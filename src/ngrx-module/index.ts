import { normalize, strings } from "@angular-devkit/core";
import {
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith,
  move,
  renameTemplateFiles,
  Rule,
  SchematicContext,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { ModuleOptions } from "./schema.d";

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngrxModule(_options: ModuleOptions): Rule {
  return chain([
    createParentFolder(_options),
    createStoreModuleFileDefinition(_options),
  ]);
}

function createStoreModuleFileDefinition(_options: ModuleOptions): Rule {
  const templateSource = apply(url("./files"), [
    filter((path) => path.endsWith(".template")),
    applyTemplates({
      ...strings,
      ..._options,
    }),
    renameTemplateFiles(),
    move(normalize(`${_options.path}/store/${_options.name}`)),
  ]);

  return mergeWith(templateSource);
}

function createParentFolder(_options: ModuleOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    tree.create(normalize(`store/${_options.name}/.gitkeep`), "");

    return tree;
  };
}
