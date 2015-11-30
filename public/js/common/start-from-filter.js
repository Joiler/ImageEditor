'use strict';

function startFrom() {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
}

module.exports = [startFrom];