'use strict';

function printImagesDirective() {
    return {
        restrict: 'A',
        scope: {
            images: '=images'
        },

        link: function (scope, element, attrs) {
            scope.loadedImages = 0;

            angular.element(element).on('click', function () {
                scope.loadedImages = 0;

                var windowContent = '<!DOCTYPE html>';
                windowContent += '<html>';
                windowContent += '<head><title>Print</title></head>';
                windowContent += '<body>';
                windowContent += '</body>';
                windowContent += '</html>';

                var printWin = window.open('about:blank', '_blank', 'left=5000,top=5000,width=0,height=0');
                printWin.document.open();
                printWin.document.write(windowContent);
                for (var i = 0, i_length = scope.images.length; i < i_length; i++) {
                    var img = new Image();
                    img.src = 'image/' + scope.images[i]._id + '?' + Date.now();
                    img.onload = function () {
                        scope.loadedImages++;
                        if (scope.loadedImages === scope.images.length) {
                            printWin.document.close();
                            printWin.focus();
                            printWin.print();
                            printWin.close();
                        }
                    };

                    try {
                        printWin.document.getElementsByTagName('body')[0].appendChild(img);
                    }
                    catch (e) {
                        if (img.outerHTML) {
                            printWin.document.getElementsByTagName('body')[0].innerHTML += img.outerHTML;
                        }
                        else {
                            window.console.log(e);
                        }
                    }
                }
            });
        }
    };
}

module.exports = printImagesDirective;
