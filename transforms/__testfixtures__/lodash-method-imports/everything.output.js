import grt from "lodash/get";
import map from "lodash/map";
import {useEffect} from "react";
import filterAlias from "lodash/filter";
import objectify from "lodash/objectify";
import catamaran from "lodash/catamaran";
import importingStuff from "lodash/importingStuff";
import moarThings from "lodash/moarThings";
import oneMoreThing from "lodash/oneMoreThing";
import defaultObj from "lodash/defaultObj";
import correctThing from "lodash/fp/correctThing"
import someFPMethod from "lodash/fp/someFPMethod";
import secondOne from "lodash/fp/secondOne";
import forEach from "lodash/fp/forEach";

function printTips() {
  forEach((tip, i) => console.log(`Tip ${i}:` + tip));
}

defaultObj({
	hello: world
})

oneMoreThing();

someFPMethod(stuff.map(s => s + 1));

secondOne("hello");
