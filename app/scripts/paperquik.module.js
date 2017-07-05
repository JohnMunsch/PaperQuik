// Copyright 2014 John Munsch
angular.module('PaperQuikApp', [
  'ngRoute',
  'ngStorage',
  'angulartics',
  'angulartics.google.analytics',
  'ui.bootstrap'
]).config(['$routeProvider', function ($routeProvider) {
  'use strict';

  $routeProvider
    .when('/', {
      template: '<pq-main></pq-main>'
    })
    .when('/paper/:paperID', {
      template: '<pq-main></pq-main>'
    })
    .when('/about', {
      template: '<pq-about></pq-about>'
    })
    .when('/layout/:layoutID', {
      template: '<pq-paper></pq-paper>'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);
