'use strict';

angular.module('PaperQuikApp').component('pqMain', {
  controller: function ($scope, $log, $routeParams, $localStorage, rendering) {
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
      $scope.selectedPaper = _.find(rendering.paperAndLayouts, { id: paperID });
    }
  },
  templateUrl: 'scripts/main.component.html'
});
