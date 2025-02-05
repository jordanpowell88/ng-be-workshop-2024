import {
  readNxJson,
  Tree,
  updateNxJson
} from '@nx/devkit';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

export async function updateScopeSchemaGenerator(
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
) {
  const nxJson = readNxJson(tree);
  nxJson.defaultProject = 'movies-app';
  updateNxJson(tree, nxJson);
}

export default updateScopeSchemaGenerator;
