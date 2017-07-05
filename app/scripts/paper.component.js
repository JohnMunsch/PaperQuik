'use strict';

const oneInch = 25.4;
const threeQuartersInch = 0.75 * oneInch;

const pixelsPerMM = 11.811023622;

angular.module('PaperQuikApp').component('pqPaper', {
  controller: class {
    constructor ($log, $timeout, $routeParams, $modal, rendering) {
      this.selectedPaper = null;
      this.selectedLayout = null;

      this.$log = $log;
      this.$timeout = $timeout;
      this.$modal = $modal;
      this.rendering = rendering;

      this.findPaperAndLayoutByID($routeParams.layoutID);

      $timeout(() => {
        this.dataURL = this.redrawCanvas(this.selectedPaper, this.selectedLayout);
      });

      paper.install(window);
    }

    // Work around minification problems.
    static get $inject() {
      return [
        '$log',
        '$timeout',
        '$routeParams',
        '$modal',
        'rendering'
      ];
    }

    mmToPixels (mm) {
      // This is the number of dots per mm in order to achieve 300 dpi. Don't ask me why you always see resolutions
      // quoted in dots per inch when virtually the entire world is on the metric system.
      return pixelsPerMM * mm;
    }

    findPaperAndLayoutByID (layoutID) {
      // Find the paper, layout, and variant using the unique ID for the combination.
      this.selectedPaper = _.find(this.rendering.paperAndLayouts, paper => {
        this.selectedLayout = _.find(paper.layouts, layout => {
          return (layout.id === layoutID);
        });

        return this.selectedLayout ? true : false;
      });
    }

    paperWidthInMM (paper) {
      if (paper) {
        return paper.width;
      } else {
        return 1;
      }
    }

    paperHeightInMM (paper) {
      if (paper) {
        return paper.height;
      } else {
        return 1;
      }
    }

    paperWidthInPixels (paper) {
      return Math.round(this.mmToPixels(this.paperWidthInMM(paper)));
    }

    paperHeightInPixels (paper) {
      return Math.round(this.mmToPixels(this.paperHeightInMM(paper)));
    }

    fills () {
      return rendering.fills;
    }

    print () {
      let modalInstance = this.$modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl'
      });

      modalInstance.result.then(() => {
        // I don't like doing it this way, but if I don't then a fragment of the Bootstrap dialog is still on-screen and
        // can mess up the print out on Windows.
        this.$timeout(() => {
          window.print();
        });
      }, () => {
        this.$log.info('Modal dismissed at: ' + new Date());
      });
    }

    redraw () {
      this.dataURL = redrawCanvas(this.selectedPaper, this.selectedLayout);
    }

    // TODO: This code needs to be drastically simplified because the layout is now doing all of the heavy lifting for the page drawing. This code should just set things up and get out of the way.

    // The canvas has already been sized to the dimensions of the paper selected. The layout specifies the number of
    // boxes on the page and their positions. The template specifies a particular set of fills, colors, outlining, etc.
    // for each box.
    //
    // For example, you might have a layout with two boxes, one large for the top 75% of the page and another small box
    // beneath it. One template would put musical staffs in the top box and some ruled lines below while another would
    // put graph paper in the top and an empty outlined box beneath.
    redrawCanvas(selectedPaper, selectedLayout) {
      // page dimensions
      let pageSize = new Size(selectedPaper.width, selectedPaper.height);
      let fullPage = new Rectangle(new Point(0, 0), pageSize);

      // Setup directly from canvas id.
      paper.setup('hiddenCanvas');

      // If we don't do this then it looks good on the page, but the downloadable PNG file has no background.
      this.fillBackground(fullPage, pixelsPerMM);

      // Iterate through all the areas for this layout and fill each one in turn.
      _.each(selectedLayout.areas, area => {
        let fill = area.fill;
        let options = _.extend({ }, fill.defaults, area.overrides);
        area.overrides = options;
        let dimensions = null;

        if (_.isFunction(area.dimensions)) {
          dimensions = area.dimensions(selectedPaper);
        } else {
          dimensions = new Rectangle(area.dimensions.x, area.dimensions.y, area.dimensions.width, area.dimensions.height);
        }

        // Adjust the size of the target area for page margins.
        let marginWidth = threeQuartersInch;
        let margins = new Rectangle(new Point(marginWidth, marginWidth),
          pageSize.subtract([ marginWidth * 2, marginWidth * 2 ]));
        let adjustedArea = dimensions.intersect(margins);

        // Adjust the size of the target area based on the pattern with which we're filling.
        adjustedArea = this.adjustAreaForPattern(adjustedArea, fill, options);

        // This is currently how I'm doing all of the scaling up of everything to page resolution (300dpi at the moment).
        fill.pixels = function (value) {
          return value * pixelsPerMM;
        };

        // Fill the area with a pattern.
        fill.render(adjustedArea, fill, options);
      });

      view.draw();

      // Pull an image out of the canvas so we can use it for preview and for printing.
      let canvas = document.getElementsByTagName('canvas')[0];
      return canvas.toDataURL();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Layout functions
    ////////////////////////////////////////////////////////////////////////////////
    adjustAreaForPattern(area, fill, options) {
      let adjustedArea = area.clone();

      // Calculate how many complete repetitions we can get in of our pattern in
      // each direction	and then how wide or tall that is.
      if (fill.horizontalPatternSize) {
        let horizontalPatternSize = fill.horizontalPatternSize(options);

        adjustedArea.width =
          Math.floor(area.width / horizontalPatternSize) * horizontalPatternSize;
      }

      if (fill.verticalPatternSize) {
        let verticalPatternSize = fill.verticalPatternSize(options);

        adjustedArea.height =
          Math.floor(area.height / verticalPatternSize) * verticalPatternSize;
      }

      return adjustedArea;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Drawing functions
    ////////////////////////////////////////////////////////////////////////////////
    fillBackground(area, pixelsInMM) {
      let shape = new Shape.Rectangle([ area.x * pixelsInMM, area.y * pixelsInMM],
        [ area.width * pixelsInMM, area.height * pixelsInMM ]);

      shape.fillColor = 'white';
    }
  },
  templateUrl: 'scripts/paper.component.html'
});

// This had to be moved out of interior of the PaperCtrl because it wasn't properly minified without it.
angular.module('PaperQuikApp').controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
  'use strict';

  $scope.chrome = conditionizr.chrome;
  $scope.firefox = conditionizr.firefox;
  $scope.ie = (conditionizr.ie9 || conditionizr.ie10 || conditionizr.ie11);
  $scope.opera = conditionizr.opera;
  $scope.safari = conditionizr.safari;

  $scope.mac = conditionizr.mac;
  $scope.windows = conditionizr.windows;

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);
