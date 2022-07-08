import React from "react";
import isObject from "lodash/fp/isObject";
import flatten from "lodash/fp/flatten";
import filter from "lodash/fp/filter";
import lodashMap from "lodash/fp/map";
import getUserFromDB from "./getUserFromDB";

function doSomething(user) {
    const randomStuff = lodashMap(arr => arr.name);
    if (isObject(user) && flatten(user).depth < 2) {
        return user.property;
    }
    return filter(el => el.name === "thing");
}

const user = getUserFromDB();

doSomething(user);
