// Copyright 2014 John Munsch
angular.module('PaperQuikApp').controller('MainCtrl', function ($scope, $log, $routeParams, $localStorage, rendering) {
  'use strict';

  $scope.$storage = $localStorage.$default({
    showWelcome: true
  });

  $scope.currentPage = 'home';

  $scope.selectedPaper = null;

  function initialize(paperID) {
    if (paperID) {
      findPaperByID(paperID);
    }
  }

  initialize($routeParams.paperID);

  $scope.paperSizes = function () {
    return rendering.paperAndLayouts;
  };

  $scope.paperIconStyle = function (paper) {
    return {
      width: paper.width / 2.8 + 'px',
      height: paper.height / 2.8 + 'px'
    };
  };

  $scope.paperLayouts = function (paper) {
    if (paper) {
      return paper.layouts;
    } else {
      return [];
    }
  };

  $scope.selectPaper = function (paper) {
    $scope.selectedPaper = paper;
  };

  function findPaperByID(paperID) {
    // Find the paper, layout, and variant using the unique ID for the combination.
    $scope.selectedPaper = _.findWhere(rendering.paperAndLayouts, { id: paperID });
  }
});
