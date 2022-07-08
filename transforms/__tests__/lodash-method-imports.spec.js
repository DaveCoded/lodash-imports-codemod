const fs = require("fs");
const path = require("path");
// eslint-disable-next-line node/no-unpublished-require
const { defineTest } = require("jscodeshift/dist/testUtils");

const name = "lodash-method-imports";

const fixturesDirectory = path.join(__dirname, "..", "__testfixtures__", name);
const fixtures = new Set(
  fs.readdirSync(fixturesDirectory).map((fileName) => fileName.split(".")[0])
);

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
