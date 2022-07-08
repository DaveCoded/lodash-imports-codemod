jest.autoMockOff();

// eslint-disable-next-line node/no-unpublished-require
const { defineTest } = require("jscodeshift/dist/testUtils");

const name = "lodash-method-imports";
const fixtures = ["default", "functional-default", "no-transform"];

describe(name, () => {
  fixtures.forEach((test) =>
    defineTest(__dirname, name, null, `${name}/${test}`)
  );
  /*
    fixtures.forEach(test =>
        defineTest(__dirname, name, null, `${name}/${test}`, {
            parser: 'tsx'
        })
    );
    */
});