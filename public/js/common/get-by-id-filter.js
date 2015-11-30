'use strict';

function getByIdFilter() {
    return function (input, id) {
        var i = 0, len = input.length;
        for (; i < len; i++) {
            if (input[i]._id === id) {
                return input[i];
            }
        }
        return null;
    };
}

module.exports = [getByIdFilter];