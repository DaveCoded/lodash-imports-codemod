import React from "react";
import filter from "lodash/filter";
import isObject from "lodash/isObject";
import lodashMap from "lodash/map";
import getUserFromDB from "./getUserFromDB";

function doSomething(user) {
    const randomStuff = lodashMap(arr => arr.name);
    if (isObject(user)) {
        return user.property;
    }
    return filter(el => el.name === "thing");
}

const user = getUserFromDB();

doSomething(user);
