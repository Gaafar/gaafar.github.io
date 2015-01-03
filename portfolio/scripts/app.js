'use strict';

/**
 * @ngdoc overview
 * @name developerPersonaApp
 * @description
 * # developerPersonaApp
 *
 * Main module of the application.
 */
angular
  .module('developerPersonaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
      })
/*      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })*/
      .otherwise({
        redirectTo: '/'
      });
  })
    .directive('afterRepeat', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    });
