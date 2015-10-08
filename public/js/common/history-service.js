'use strict';

function HistoryService($http, Alertify) {
    var historyItems = [];

    var load = function () {
        return $http({
            url: '/history/?' + Date.now(),
            method: 'get'
        }).then(
            function (response) {
                if (response.data.success === true) {
                    historyItems = response.data.result;
                }
                return historyItems;
            }, function (response) {
                printError();
            });
    };

    var rollbackHistoryItem = function (historyItem) {
        return $http({
            url: '/history/' + historyItem._id,
            method: 'post'
        }).then(
            function (response) {
                if (response.data.success !== true) {
                    printError();
                }
            }, function (response) {
                printError();
            });
    };

    var clearHistory = function () {
        return $http({
            url: '/history',
            method: 'delete'
        }).then(
            function (response) {
                if (response.data.success !== true) {
                    printError();
                }
            }, function (response) {
                printError();
            });
    };

    var getHistoryItems = function () {
        return historyItems;
    };

    var printError = function () {
        Alertify.error('Error! Please, try again.');
    };

    return {
        load: load,
        rollbackHistoryItem: rollbackHistoryItem,
        clearHistory: clearHistory,
        getHistoryItems: getHistoryItems
    };
}

module.exports = ['$http', 'Alertify', HistoryService];