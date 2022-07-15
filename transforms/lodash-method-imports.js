/*
========================================================================
====================          UTILS          ===========================
========================================================================
*/
const isLodashImport = (node) => node.source.value.startsWith("lodash");

const isCorrectMethodImport = (node) => {
  const { specifiers, source } = node;
  const specifierName = specifiers[0].local.name;
  const { value } = source;

  return (
    specifiers.length === 1 &&
    specifiers[0].type === "ImportDefaultSpecifier" &&
    [`lodash/${specifierName}`, `lodash/fp/${specifierName}`].includes(value)
  );
};

const replaceExpression = (path, j) =>
  j.callExpression(
    j.identifier(path.node.callee.property.name),
    path.node.arguments
  );

const getLodashExpressionFunction = (name) => (expressionNode) =>
  expressionNode.callee.type === "MemberExpression" &&
  expressionNode.callee.object &&
  expressionNode.callee.object.name === name;

/*
========================================================================
====================        TRANSFORM        ===========================
========================================================================
*/
module.exports = function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  const firstNode = () => root.find(j.Program).get("body", 0);
  const comment = firstNode().node.leadingComments;

  root.find(j.ImportDeclaration, isLodashImport).forEach((path) => {
    const { node } = path;

    if (isCorrectMethodImport(node)) return;

    // If import is not already "correct", it will change
    changed = true;
    const { specifiers } = node;

    specifiers.forEach((specifier) => {
      if (
        ["ImportDefaultSpecifier", "ImportNamespaceSpecifier"].includes(
          specifier.type
        )
      ) {
        const { name } = specifier.local;
        const methodsUsed = new Set();
        const isLodashExpression = getLodashExpressionFunction(name);

        // Replace all calls to methods on the default export; e.g. _.map(args) => map(args)
        root
          .find(j.CallExpression, isLodashExpression)
          .forEach((p) => methodsUsed.add(p.node.callee.property.name)) // Collect methods used
          .replaceWith((p) => replaceExpression(p, j));

        // Add a new import above this node for each lodash method used in body of code
        methodsUsed.forEach((method) => {
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
    firstNode().node.comments = comment;
  });

  return changed ? root.toSource() : null;
};

module.exports.parser = "tsx";
