/*
    NOTES:
     - Does not support CJS imports, i.e. const map = require('lodash/map');
     - Comments at the top of the file are preserved
     - Comments above other lodash imports 

    CASES:
    0.  ✅ Leave correct imports as they are
    1.  ✅ import _ from 'lodash' => normal default import
    2.  ✅ import _ from 'lodash/fp' => functional default import
    3.  ✅ import { filter } from 'lodash' => normal named import
    4.  ✅ import { filter } from 'lodash/fp' => functional named import
    5.  ✅ import { map as lodashMap } from 'lodash' => normal named import with alias
    6.  ✅ import { map as lodashMap } from 'lodash/fp' => functional named import with alias
    7.  ✅ import _, { map } from 'lodash' => mix of default and named imports
    8.  ✅ import _, { map } from 'lodash/fp' => mix of default and named functional imports
    9.  ✅ Only call toSource when source has changed
    10. ✅ Add missing test cases
    11. PRESERVE COMMENTS
       a) ✅ Preserve comments at the top of the file if they are above a lodash import
       b) ✅ Do the same even if there's a space between comments and import!!
    12. Convert project to TS and try .tsx test fixtures
    13. TODO in spec file

    BONUS:
    a) import * as _ from 'lodash' => import all
    b) import * as _ from 'lodash/fp' => import all functional
    c) import * as camelCase from 'lodash/camelcase' => import all from method file
    d) import * as camelCase from 'lodash/fp/camelCase' => import all functional from method file
*/

const {
  isLodashImport,
  isCorrectMethodImport,
  getLodashExpressionFunction,
  replaceExpression,
} = require("../utils");

module.exports = function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.find(j.ImportDeclaration, isLodashImport).forEach((path) => {
    const { node } = path;
    if (isCorrectMethodImport(node)) return;
    changed = true;

    const { specifiers } = node;

    specifiers.forEach((specifier) => {
      if (specifier.type === "ImportDefaultSpecifier") {
        const { name } = specifier.local;
        const methodsUsed = new Set();
        const isLodashExpression = getLodashExpressionFunction(name);

        /**
         * Replace all lodash call expressions in the source's body
         * _.isObject(myObj) => isObject(myObj)
         * Works for normal and fp
         */
        root
          .find(j.CallExpression, isLodashExpression)
          .forEach((p) => methodsUsed.add(p.node.callee.property.name)) // Collect methods used
          .replaceWith((p) => replaceExpression(p, j));

        // Add a new import above this node for each lodash method used in body of code (works for normal and fp)
        methodsUsed.forEach((method) => {
          // For the first one, if there are no named imports, add comments to the new node
          const newImport = j.importDeclaration(
            [j.importDefaultSpecifier(j.identifier(method))],
            j.literal(`${node.source.value}/${method}`)
          );

          j(path).insertBefore(newImport);
        });
      } else {
        // Is named import
        const fileName = specifier.imported.name;
        const importName = specifier.local.name;

        const newImport = j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier(importName))],
          j.stringLiteral(`${node.source.value}/${fileName}`)
        );

        j(path).insertBefore(newImport);
      }
    });

    j(path).remove();
  });

  return changed ? root.toSource() : null;
};
