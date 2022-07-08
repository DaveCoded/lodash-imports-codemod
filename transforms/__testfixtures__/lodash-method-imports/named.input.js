import React from "react";
import {filter, isObject, map as lodashMap} from "lodash";
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
