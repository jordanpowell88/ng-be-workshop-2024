import {
  formatFiles,
  getProjects,
  ProjectConfiguration,
  Tree,
  updateJson
} from '@nx/devkit';

export async function updateScopeSchemaGenerator(
  tree: Tree
) {
  const projects = getProjects(tree);
  const scopes = getScopes(projects);
  updateSchemaJson(tree, scopes)
  updateSchemaInterface(tree, scopes)
  await formatFiles(tree);
}

function updateSchemaJson(tree: Tree, scopes: string[]) {
  updateJson(tree, 'libs/internal-plugin/src/generators/util-lib/schema.json',
    (schemaJson) => {
      schemaJson.properties.directory['x-prompt'].options = scopes
      schemaJson.properties.directory.enums = scopes;
      return schemaJson
    }
  )
}

function updateSchemaInterface(tree: Tree, scopes: string[]) {
  const joinScopes = scopes.map((scope) => `'${scope}'`).join(' | ');
  const interfaceDefinitionFilePath = `libs/internal-plugin/src/generators/util-lib/schema.d.ts`;
  const newContent = `export interface UtilLibGeneratorSchema {
    name: string;
    directory: ${joinScopes};
}`;
  tree.write(interfaceDefinitionFilePath, newContent);
}


function getScopes(projectMap: Map<string, ProjectConfiguration>) {
  const allScopes: string[] = Array.from(projectMap.values())
    .map((project) => {
      if (project.tags) {
        const scopes = project.tags.filter((tag: string) => tag.startsWith('scope:'));
        return scopes;
      }
      return []
    })
    .reduce((acc, tags) => [...acc, ...tags], [])
    .map((scope: string) => scope.slice(6));

  // remove duplicates
  return Array.from(new Set(allScopes));
}

export default updateScopeSchemaGenerator;
