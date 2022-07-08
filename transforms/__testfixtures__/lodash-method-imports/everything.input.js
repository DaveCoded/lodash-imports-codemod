import { get as grt } from "lodash";
import map from "lodash/map";
import {useEffect} from "react";
import { filter as filterAlias, objectify, catamaran } from "lodash";
import _, { moarThings, importingStuff } from "lodash";
import correctThing from "lodash/fp/correctThing"
import functionalLodash from "lodash/fp";
import {forEach} from "lodash/fp";

function printTips() {
  forEach((tip, i) => console.log(`Tip ${i}:` + tip));
}

_.defaultObj({
	hello: world
})

_.oneMoreThing();

functionalLodash.someFPMethod(stuff.map(s => s + 1));

functionalLodash.secondOne("hello");
