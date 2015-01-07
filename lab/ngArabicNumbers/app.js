/**
 * Created by Mostafa on 01/03/2015.
 */
'use strict';

angular.module('app', ['arabic-numbers'])

    .controller('testController', function ($scope) {
        $scope.number = "1,234,567.890";
        $scope.isArabic = true;

        $scope.toggleArabic = function () {
            $scope.isArabic = !$scope.isArabic;
        };

    })