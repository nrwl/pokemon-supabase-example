import { Linter, lintProjectGenerator } from '@nrwl/linter';
import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { PlaywrightProjectGeneratorSchema } from './schema';
import { getRelativePathToRootTsConfig } from '@nrwl/workspace/src/utilities/typescript';

interface NormalizedSchema extends PlaywrightProjectGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  rootTsConfigPath: string;
  offsetFromRoot: string;
}

function normalizeOptions(
  tree: Tree,
  options: PlaywrightProjectGeneratorSchema
): NormalizedSchema {
  if (!options.name) {
    if (options.frontendProject) {
      options.name = `${options.frontendProject}-e2e`;
    } else {
      options.name = 'playwright-e2e-tests';
    }
  }
  if (!options.frontendProject) {
    options.frontendProject = '';
  }
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    rootTsConfigPath: getRelativePathToRootTsConfig(tree, projectRoot),
    offsetFromRoot: offsetFromRoot(projectRoot),
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (
  tree: Tree,
  options: PlaywrightProjectGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  const root = normalizedOptions.projectRoot;
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      e2e: {
        executor: '@pokemon-supabase-example/playwright-plugin:playwright',
        options: {
          playwrightConfig: `playwright.config.ts`,
        },
        outputs: [`${root}/playwright-report`],
      },
      debug: {
        executor: '@pokemon-supabase-example/playwright-plugin:playwright',
        options: {
          playwrightConfig: `playwright.config.ts`,
          debug: true,
          project: 'chromium',
          timeout: 0,
        },
      },
      'show-report': {
        executor: '@pokemon-supabase-example/playwright-plugin:show-report',
      },
      lint: {
        executor: '@nrwl/linter:eslint',
        outputs: ['{options.outputFile}'],
        options: {
          lintFilePatterns: [`${root}/**/*.{js,ts}`],
        },
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await addLinter(tree, normalizedOptions);
  await formatFiles(tree);
}

async function addLinter(host: Tree, options: NormalizedSchema) {
  const installTask = await lintProjectGenerator(host, {
    project: options.projectName,
    linter: Linter.EsLint,
    skipFormat: true,
    tsConfigPaths: [joinPathFragments(options.projectRoot, 'tsconfig.json')],
    eslintFilePatterns: [`${options.projectRoot}/**/*.{js,ts}`],
  });

  return installTask;
}
