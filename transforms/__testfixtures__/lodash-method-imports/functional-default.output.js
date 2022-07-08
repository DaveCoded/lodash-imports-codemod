import React from 'react';
import isObject from 'lodash/fp/isObject';
import filter from 'lodash/fp/filter';
import getUserFromDB from './getUserFromDB';

function doSomething(user) {
    if (isObject(user)) {
        return user.property;
    }
    return filter(el => el.name === 'thing');
}

const user = getUserFromDB();

doSomething(user);
