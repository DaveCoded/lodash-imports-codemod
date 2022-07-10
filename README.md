A jscodeshift codemod for transforming various lodash imports to single method imports.

## Contents

1. [Usage](#usage)
2. [Cases covered](#cases-covered)
3. [Not supported](#not-supported)
4. [Known issues](#known-issues)

## Usage

`npm start` will run jscodeshift with the transform. You can then pass any optional parameters (such as a parser) and a path to the directory of files you want to transform.

```shell
npm start path/to/files --parser=tsx
```

## Cases covered

1. [Default imports](#default-import) from `lodash`. The identifier can be given any name — the examples just use `_` as a convention.
2. [Named imports](#named-imports) from `lodash`. Any number of named imports are handled.
3. [Import aliases](#named-import-alias) for named imports. Also handled for multiple named imports, multiple aliases and mixture of named and default imports.
4. [Mixture of named and default imports](#mixed-default-and-named-imports)
5. [Import all as object](#import-all-as-object) using the asterisk (\*) syntax
6. [Imports from lodash/fp](#lodashfp-imports)

### Default import

Original:

```js
import _ from "lodash";

_.chunk(["a", "b", "c", "d"], 2);

const array = [1];
const other = _.concat(array, 2, [3], [[4]]);
```

Transformed:

```js
import chunk from "lodash/chunk";
import concat from "lodash/concat";

chunk(["a", "b", "c", "d"], 2);

const array = [1];
const other = concat(array, 2, [3], [[4]]);
```

### Named imports

Original:

```js
import { chunk, compact, difference } from "lodash";

const arr1 = chunk(["a", "b", "c", "d"], 2);
const arr2 = compact([0, 1, false, 2, "", 3]);
const diff = difference(arr1, arr2);
```

Transformed:

```js
import chunk from "lodash/chunk";
import compact from "lodash/compact";
import difference from "lodash/difference";

const arr1 = chunk(["a", "b", "c", "d"], 2);
const arr2 = compact([0, 1, false, 2, "", 3]);
const diff = difference(arr1, arr2);
```

### Named import alias

Original:

```js
import { difference as diff } from "lodash";

diff(arr1, arr2);
```

Transformed:

```js
import diff from "lodash/difference";

diff(arr1, arr2);
```

### Mixed default and named imports

Original:

```js
import _, { head } from "lodash";

const arr = [1, 2, 3];
const top = head(arr);
const tail = _.last(arr);
```

Transformed:

```js
import tail "lodash/tail";
import head "lodash/head";

const arr = [1, 2, 3];
const top = head(arr);
const tail = last(arr);
```

### Import all as object

Original:

```js
import * as _ from "lodash";

_.chunk(["a", "b", "c", "d"], 2);

const array = [1];
const other = _.concat(array, 2, [3], [[4]]);
```

Transformed:

```js
import chunk from "lodash/chunk";
import concat from "lodash/concat";

chunk(["a", "b", "c", "d"], 2);

const array = [1];
const other = concat(array, 2, [3], [[4]]);
```

### lodash/fp imports

All the above cases also apply to imports from `lodash/fp`

Original:

```js
import _ from "lodash/fp";
import { map as fpMap } from "lodash/fp";

_.padStart(3)("a");
fpMap(parseInt)(["6", "8", "10"]);
```

Transformed:

```js
import padStart from "lodash/fp/padStart";
import fpMap from "lodash/fp/map";

padStart(3)("a");
fpMap(parseInt)(["6", "8", "10"]);
```

## Not supported

### Common JS module imports with require

Because the motivation for this codemod was reducing client bundle size, I have not supported transformations for this kind of import:

```js
const _ = require("lodash");
```

**Also any other use cases I haven't thought of**

## Known issues

### Comments

Any comments at the top of the file will be preserved. If the first import is a `lodash` import, you will get an added line break after the transformed import due to this [behaviour in Recast](https://github.com/benjamn/recast/issues/405#issuecomment-307255294):

Before:

```js
/**
 * Some JSDoc comment, for instance, but any kind
 * and any number of comments are supported
 */

import { shuffle, invokeMap } from "lodash";
import React, { useEffect } from "react";
```

After:

```js
/**
 * Some JSDoc comment, for instance, but any kind
 * and any number of comments are supported
 */

import shuffle from "lodash/shuffle";
import invokeMap from "lodash/invokeMap"; // Unwanted line break after this

import React, { useEffect } from "react";
```
