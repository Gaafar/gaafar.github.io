'use strict';

angular.module('cube-spinner', []).directive('cubeSpinner', function () {
    return {
        restrict: 'E',
        templateUrl: 'ngCubeSpinner/views/ngCubeSpinner.html',
        scope: {
            'show': '=show'
        },
        link: function (scope, element, attrs) {

            var el = angular.element(element);

            scope.$watch('show', function (newValue, oldValue) {
                if (newValue == oldValue) {
                    return;
                }
                if (newValue) {
                    el.css('display','block');
                } else {
                    el.css('display','none');
                }
            });
        }
    };
});
