import { readJson, Tree, updateJson } from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import generator from './generator';
import { Schema } from './schema';

describe('init generator', () => {
  let appTree: Tree;
  const options: Schema = {};

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should add playwright dependency if missing', async () => {
    generator(appTree, options);
    const packageJson = readJson(appTree, 'package.json');
    expect(packageJson.devDependencies['@playwright/test']).toBe('^1.25.1');
  });

  it('should update playwright dependency if existing', async () => {
    updateJson(appTree, 'package.json', (json) => {
      json.devDependencies['@playwright/test'] = '^1.0.0';
      return json;
    });
    generator(appTree, options);
    const packageJson = readJson(appTree, 'package.json');
    expect(packageJson.devDependencies['@playwright/test']).toBe('^1.25.1');
  });

  it('should not change dep version if skip option is turned on', async () => {
    updateJson(appTree, 'package.json', (json) => {
      json.devDependencies['@playwright/test'] = '^1.0.0';
      return json;
    });
    const options: Schema = { skipPackageJson: true };
    generator(appTree, options);
    const packageJson = readJson(appTree, 'package.json');
    expect(packageJson.devDependencies['@playwright/test']).toBe('^1.0.0');
  });

  it('should update .gitignore', async () => {
    generator(appTree, options);
    const gitIgnore = appTree.read('.gitignore')?.toString('utf-8');
    expect(gitIgnore).toContain(`# Playwright`);
  });

  it('should idempotently update .gitignore', async () => {
    appTree.write('.gitignore', `# Playwright`);
    generator(appTree, options);
    const gitIgnore = appTree.read('.gitignore')?.toString('utf-8');
    const instancesOfPlaywrightSection =
      gitIgnore?.split('# Playwright').length - 1;
    expect(instancesOfPlaywrightSection).toBe(1);
  });
});
