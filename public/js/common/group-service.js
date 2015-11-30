'use strict';

function GroupService(Alertify) {
    var groupImageIds = [];

    var resetGroup = function () {
        groupImageIds.splice(0, groupImageIds.length);
    };

    var addImageIdToGroup = function (id) {
        if (groupImageIds.length >= 10) {
            Alertify.error('Group couldn\'t contain more than 10 images');
            return;
        }
        groupImageIds.push(id);
    };

    var removeImageIdFromGroup = function (id) {
        groupImageIds.splice(groupImageIds.indexOf(id), 1);
    };

    var saveGroupImageIds = function (ids) {
        groupImageIds = ids;
    };

    var getGroupImageIds = function () {
        return groupImageIds;
    };

    var removeIfImageExists = function (id) {
        var index = groupImageIds.indexOf(id);
        if (index > -1) {
            groupImageIds.splice(index, 1);
        }
    };

    return {
        resetGroup: resetGroup,
        addImageIdToGroup: addImageIdToGroup,
        removeImageIdFromGroup: removeImageIdFromGroup,
        saveGroupImageIds: saveGroupImageIds,
        getGroupImageIds: getGroupImageIds,
        removeIfImageExists: removeIfImageExists
    };

}

module.exports = ['Alertify', GroupService];