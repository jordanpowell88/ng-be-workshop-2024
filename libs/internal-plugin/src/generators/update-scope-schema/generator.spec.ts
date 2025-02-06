import { formatFiles, readJson, Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { libraryGenerator } from '@nx/js/src/generators/library/library';
import { generatorGenerator, pluginGenerator } from '@nx/plugin/generators';
import { readFileSync } from 'fs';
import { join } from 'path';
import generator from './generator';

const expectedInterface = `export interface UtilLibGeneratorSchema {
  name: string;
  directory: 'foo' | 'bar';
}`;

describe('update-scope-schema generator', () => {
  let appTree: Tree;
  

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace();
    await addUtilLibProject(appTree);
    await libraryGenerator(appTree, { name: 'foo', tags: 'scope:foo', directory: 'libs/foo' });
    await libraryGenerator(appTree, { name: 'bar', tags: 'scope:bar', directory: 'libs/bar' });
    formatFiles(appTree);
  });

  it('should adjust the util-lib generator based on existing projects', async () => {
    await generator(appTree);
    const schemaJson = readJson(
      appTree,
      'libs/internal-plugin/src/generators/util-lib/schema.json'
    );

    expect(schemaJson.properties.directory['x-prompt'].options).toEqual(['foo', 'bar']);
    expect(schemaJson.properties.directory.enums).toEqual(['foo', 'bar']);

    const schemaInterface = appTree.read('libs/internal-plugin/src/generators/util-lib/schema.d.ts', 'utf-8');

    expect(schemaInterface).toContain(expectedInterface);
  })
});


async function addUtilLibProject(tree: Tree) {
  await pluginGenerator(tree, {
    name: 'internal-plugin',
    directory: 'libs/internal-plugin',
    skipTsConfig: false,
    unitTestRunner: 'jest',
    linter: 'eslint',
    compiler: 'tsc',
    skipFormat: false,
    skipLintChecks: false
  });
  await generatorGenerator(tree, {
    name: 'util-lib',
    path: 'libs/internal-plugin/src/generators/util-lib',
    unitTestRunner: 'jest',
  });
  const filesToCopy = [
    '../util-lib/generator.ts',
    '../util-lib/schema.json',
    '../util-lib/schema.d.ts',
  ];
  for (const file of filesToCopy) {
    tree.write(
      `libs/internal-plugin/src/generators/util-lib/${file}`,
      readFileSync(join(__dirname, file))
    );
  }
}