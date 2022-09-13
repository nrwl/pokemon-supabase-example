import { Tree, updateJson } from '@nrwl/devkit';
import { Schema } from './schema';

export default async function (tree: Tree, options: Schema) {
  if (!options.skipPackageJson) {
    updateDependencies(tree);
  }
  updateGitIgnore(tree);
}

function updateDependencies(tree: Tree) {
  updateJson(tree, 'package.json', (json) => {
    if (!json.devDependencies) {
      json.devDependencies = {};
    }
    json.devDependencies['@playwright/test'] = '^1.25.1';
    return json;
  });
}

function updateGitIgnore(tree: Tree) {
  const initialGitIgnoreContexts = tree.read('.gitignore')?.toString('utf-8');
  const alreadyHasPlaywrightGitIgnoreSection =
    initialGitIgnoreContexts?.includes(`# Playwright`);
  if (alreadyHasPlaywrightGitIgnoreSection) {
    return;
  }
  const textToAdd = `

# Playwright
**/test-results/
**/playwright-report/
**/playwright/.cache/
`;
  tree.write('.gitignore', initialGitIgnoreContexts + textToAdd);
}
