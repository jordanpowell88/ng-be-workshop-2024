import { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js'
import { UtilLibGeneratorSchema } from './schema';
import { formatFiles } from '@nx/devkit';

export default async function (tree: Tree, options: UtilLibGeneratorSchema) {
  const utilName = `util-${options.name}`;
  await libraryGenerator(tree, {
    directory: `libs/${options.directory}/${utilName}`,
    name: `${options.directory}-${utilName}`,
    tags: `type:util,scope:${options.directory}`,
  });
  await formatFiles(tree);
}
