'use strict';

function LoadingService() {
    var currentState = {
        visible: false
    };

    var showLoading = function () {
        currentState.visible = true;
    };

    var hideLoading = function () {
        currentState.visible = false;
    };

    return {
        showLoading: showLoading,
        hideLoading: hideLoading,
        currentState: currentState
    };

}

module.exports = LoadingService;