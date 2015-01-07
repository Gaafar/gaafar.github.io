/**
 * Created by Mostafa on 01/03/2015.
 */
'use strict';

angular.module('app', ['cube-spinner'])

    .controller('testController',function($scope){
    $scope.showSpinner=true;

    $scope.toggleSpinner= function(){
        $scope.showSpinner=!$scope.showSpinner;
    };

})

//TODO: add more practical examples