import { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js'
import { UtilLibGeneratorSchema } from './schema';
import { formatFiles } from '@nx/devkit';

export default async function (tree: Tree, options: UtilLibGeneratorSchema) {
  await libraryGenerator(tree, {
    directory: `libs/${options.directory}/${options.name}`,
    name: `util-${options.name}`,
    tags: `type:util,scope:${options.directory}`
  });
  await formatFiles(tree);
}
