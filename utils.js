const isLodashImport = (node) => node.source.value.startsWith("lodash");

/**
 * If import is already in the form 'import method from "lodash/method"'
 * or 'import method from "lodash/fp/method"', then it's already correct
 * and doesn't need changing
 */
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

module.exports = {
  isLodashImport,
  isCorrectMethodImport,
  replaceExpression,
  getLodashExpressionFunction,
};
