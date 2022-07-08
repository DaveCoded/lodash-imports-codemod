import React from "react";
import _ from "random-lib";
import getUserFromDB from "./getUserFromDB";

function doSomething(user) {
    if (_.isObject(user)) {
        return user.property;
    }
    return _.filter(el => el.name === "thing");
}

const user = getUserFromDB();

doSomething(user);
