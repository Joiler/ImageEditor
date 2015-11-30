'use strict';

function HistoryController($scope, $state, filterFilter, HistoryService) {
    $scope.historyItems = HistoryService.getHistoryItems();
    $scope.hash = Date.now();

    $scope.generateUrlForPreviousImage = function (historyItem) {
        if (historyItem.isRemoved) {
            return 'image/' + historyItem.imageId + '?' + $scope.hash;
        } else {
            return 'history/' + historyItem._id + '?' + $scope.hash;
        }
    };

    //paging logic
    $scope.entryLimit = 12;
    $scope.currentPage = 1;
    $scope.totalItems = $scope.historyItems.length;

    $scope.updatePageSettings = function () {
        $scope.filtered = filterFilter($scope.historyItems, $scope.searchHistoryItems);
        $scope.totalItems = $scope.filtered.length;
        $scope.currentPage = 1;
    };

    //search logic
    $scope.searchSettings = {
        imageName: "",
        action: "",
        extension: ""
    };

    $scope.$watch('searchSettings', function () {
        $scope.updatePageSettings();
    }, true);

    $scope.resetSearchSettings = function () {
        $scope.searchSettings = {
            imageName: "",
            action: "",
            extension: ""
        };
    };

    $scope.searchHistoryItems = function (historyItem) {
        var result = true;
        if ($scope.searchSettings.extension) {
            var regexExtension = new RegExp($scope.searchSettings.extension, 'i');
            result = result && regexExtension.test(historyItem.extension);
        }
        if ($scope.searchSettings.action && result) {
            switch ($scope.searchSettings.action) {
                case "1":
                    result = result && historyItem.isRemoved === true;
                    break;
                case "2":
                    result = result && historyItem.isRemoved === false;
                    break;
            }
        }
        if ($scope.searchSettings.imageName && result) {
            var regex = new RegExp($scope.searchSettings.imageName, 'i');
            result = result && regex.test(historyItem.name);
        }
        return result;
    };

    //history rollback logic
    $scope.rollbackHistoryItem = function (historyItem) {
        HistoryService.rollbackHistoryItem(historyItem).then(function () {
            $state.go('edit', {id: historyItem.imageId});
        });
    };

    //clear history logic
    $scope.clearAllHistory = function () {
        HistoryService.clearHistory().then(function () {
            $state.go('list');
        });
    };

}

module.exports = ['$scope', '$state', 'filterFilter', 'HistoryService', HistoryController];