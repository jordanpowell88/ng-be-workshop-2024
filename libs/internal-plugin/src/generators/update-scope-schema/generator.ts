import {
  NxJsonConfiguration,
  Tree,
  updateNxJson
} from '@nx/devkit';
import { UpdateScopeSchemaGeneratorSchema } from './schema';

export async function updateScopeSchemaGenerator(
  tree: Tree,
  options: UpdateScopeSchemaGeneratorSchema
) {
  updateNxJson(tree, (nxJson: NxJsonConfiguration) => {
    nxJson.defaultProject = 'movies-app';
    return nxJson;
  })
}

export default updateScopeSchemaGenerator;
