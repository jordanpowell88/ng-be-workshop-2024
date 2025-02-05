import { UtilLibGeneratorSchema } from "./schema";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { Tree, readProjectConfiguration } from "@nx/devkit";
import generator from './generator'

describe('util-lib generator', () => {
  let appTree: Tree;
  const options: UtilLibGeneratorSchema = {
    name: 'foo',
    directory: 'movies'
  }

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  })

  it('should add util to the name and add appropriate tags', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'movies-util-foo');
    expect(config).toBeDefined();
    expect(config.tags).toEqual(['type:util', 'scope:movies']);
    expect(config.name).toEqual('movies-util-foo');
  })
})