'use strict';

angular.module('PaperQuikApp').component('pqMain', {
  controller: class {
    constructor ($routeParams, $localStorage, rendering) {
      this.selectedPaper = null;
      this.rendering = rendering;

      this.$storage = $localStorage.$default({
        showWelcome: true
      });

      if ($routeParams.paperID) {
        // Find the paper, layout, and variant using the unique ID for the combination.
        this.selectedPaper = _.find(rendering.paperAndLayouts, { id: $routeParams.paperID });
      }
    }

    // Work around minification problems.
    static get $inject() {
      return [
        '$routeParams',
        '$localStorage',
        'rendering'
      ];
    }

    paperSizes () {
      return this.rendering.paperAndLayouts;
    }

    paperIconStyle (paper) {
      return {
        width: paper.width / 2.8 + 'px',
        height: paper.height / 2.8 + 'px'
      };
    }

    paperLayouts (paper) {
      if (paper) {
        return paper.layouts;
      } else {
        return [];
      }
    }

    selectPaper (paper) {
      this.selectedPaper = paper;
    }
  },
  templateUrl: 'scripts/main.component.html'
});
