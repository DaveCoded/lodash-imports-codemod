import React from "react";
import _, {filter, map as lodashMap} from "lodash/fp";
import getUserFromDB from "./getUserFromDB";

function doSomething(user) {
    const randomStuff = lodashMap(arr => arr.name);
    if (_.isObject(user) && _.flatten(user).depth < 2) {
        return user.property;
    }
    return filter(el => el.name === "thing");
}

const user = getUserFromDB();

doSomething(user);
