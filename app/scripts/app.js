// Copyright 2014 John Munsch
angular.module('PaperQuikApp', [ 'ngRoute', 'ngStorage', 'angulartics', 'angulartics.google.analytics', 'ui.bootstrap' ])
    .config(function ($routeProvider) {
  'use strict';

  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/paper/:paperID', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/about', {
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl'
  })
  .when('/layout/:layoutID', {
    templateUrl: 'views/paper.html',
    controller: 'PaperCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});
