import React from "react";
import isObject from "lodash/isObject";
import filter from "lodash/filter";
import getUserFromDB from "./getUserFromDB";

function doSomething(user) {
    if (isObject(user)) {
        return user.property;
    }
    return filter(el => el.name === "thing");
}

const user = getUserFromDB();

doSomething(user);
