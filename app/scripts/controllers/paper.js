// Copyright 2014 John Munsch
var app = angular.module('PaperQuikApp');

app.controller('PaperCtrl', function ($scope, $log, $timeout, $location,
    $routeParams, $modal, rendering) {
  'use strict';

  var oneInch = 25.4;
  var threeQuartersInch = 0.75 * oneInch;
  // var halfInch = 0.5 * oneInch;

  var pixelsPerMM = 11.811023622;

  $scope.currentPage = 'paper';

  $scope.selectedPaper = null;
  $scope.selectedLayout = null;

  $scope.displayHeader = true;

  function initialize(layoutID) {
    findPaperAndLayoutByID(layoutID);

    $timeout(function () {
      $scope.dataURL = redrawCanvas($scope.selectedPaper, $scope.selectedLayout);
    });
  }

  initialize($routeParams.layoutID);

  $scope.paperWidthInMM = function (paper) {
    if (paper) {
      return paper.width;
    } else {
      return 1;
    }
  };

  $scope.paperHeightInMM = function (paper) {
    if (paper) {
      return paper.height;
    } else {
      return 1;
    }
  };

  $scope.paperWidthInPixels = function (paper) {
    return Math.round(mmToPixels($scope.paperWidthInMM(paper)));
  };

  $scope.paperHeightInPixels = function (paper) {
    return Math.round(mmToPixels($scope.paperHeightInMM(paper)));
  };

  $scope.fills = function () {
    return rendering.fills;
  };

  $scope.print = function () {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl'
    });

    modalInstance.result.then(function () {
      // I don't like doing it this way, but if I don't then a fragment of the Bootstrap dialog is still on-screen and
      // can mess up the print out on Windows.
      $timeout(function () {
        window.print();
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.redraw = function () {
    $scope.dataURL = redrawCanvas($scope.selectedPaper, $scope.selectedLayout);
  };

  function mmToPixels(mm) {
    // This is the number of dots per mm in order to achieve 300 dpi. Don't ask me why you always see resolutions
    // quoted in dots per inch when virtually the entire world is on the metric system.
    return pixelsPerMM * mm;
  }

  function findPaperAndLayoutByID(layoutID) {
    // Find the paper, layout, and variant using the unique ID for the combination.
    $scope.selectedPaper = _.find(rendering.paperAndLayouts, function (paper) {
      $scope.selectedLayout = _.find(paper.layouts, function (layout) {
        return (layout.id === layoutID);
      });

      return $scope.selectedLayout ? true : false;
    });
  }

  paper.install(window);

  // TODO: This code needs to be drastically simplified because the layout is now doing all of the heavy lifting for the
  // TODO: page drawing. This code should just set things up and get out of the way.

  // The canvas has already been sized to the dimensions of the paper selected. The layout specifies the number of boxes
  // on the page and their positions. The template specifies a particular set of fills, colors, outlining, etc. for
  // each box.
  //
  // For example, you might have a layout with two boxes, one large for the top 75% of the page and another small box
  // beneath it. One template would put musical staffs in the top box and some ruled lines below while another would put
  // graph paper in the top and an empty outlined box beneath.
  function redrawCanvas(selectedPaper, selectedLayout) {
    // page dimensions
    var pageSize = new Size(selectedPaper.width, selectedPaper.height);
    var fullPage = new Rectangle(new Point(0, 0), pageSize);

    // Setup directly from canvas id.
    paper.setup('hiddenCanvas');

    // If we don't do this then it looks good on the page, but the downloadable PNG file has no background.
    fillBackground(fullPage, pixelsPerMM);

    // Iterate through all the areas for this layout and fill each one in turn.
    _.each(selectedLayout.areas, function (area) {
      var fill = area.fill;
      var options = _.extend({ }, fill.defaults, area.overrides);
      area.overrides = options;
      var dimensions = null;

      if (_.isFunction(area.dimensions)) {
        dimensions = area.dimensions(selectedPaper);
      } else {
        dimensions = new Rectangle(area.dimensions.x, area.dimensions.y, area.dimensions.width, area.dimensions.height);
      }

      // Adjust the size of the target area for page margins.
      var marginWidth = threeQuartersInch;
      var margins = new Rectangle(new Point(marginWidth, marginWidth),
          pageSize.subtract([ marginWidth * 2, marginWidth * 2 ]));
      var adjustedArea = dimensions.intersect(margins);

      // Adjust the size of the target area based on the pattern with which we're filling.
      adjustedArea = adjustAreaForPattern(adjustedArea, fill, options);

      // This is currently how I'm doing all of the scaling up of everything to page resolution (300dpi at the moment).
      fill.pixels = function (value) {
        return value * pixelsPerMM;
      };

      // Fill the area with a pattern.
      fill.render(adjustedArea, fill, options);
    });

    view.draw();

    // Pull an image out of the canvas so we can use it for preview and for printing.
    var canvas = document.getElementsByTagName('canvas')[0];
    return canvas.toDataURL();
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Layout functions
  ////////////////////////////////////////////////////////////////////////////////
  function adjustAreaForPattern(area, fill, options) {
    var adjustedArea = area.clone();

    // Calculate how many complete repetitions we can get in of our pattern in
    // each direction	and then how wide or tall that is.
    if (fill.horizontalPatternSize) {
      var horizontalPatternSize = fill.horizontalPatternSize(options);

      adjustedArea.width =
          Math.floor(area.width / horizontalPatternSize) * horizontalPatternSize;
    }
    if (fill.verticalPatternSize) {
      var verticalPatternSize = fill.verticalPatternSize(options);

      adjustedArea.height =
          Math.floor(area.height / verticalPatternSize) * verticalPatternSize;
    }

    return adjustedArea;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Drawing functions
  ////////////////////////////////////////////////////////////////////////////////
  function fillBackground(area, pixelsInMM) {
    var shape = new Shape.Rectangle([ area.x * pixelsInMM, area.y * pixelsInMM],
        [ area.width * pixelsInMM, area.height * pixelsInMM ]);

    shape.fillColor = 'white';
  }
});

// This had to be moved out of interior of the PaperCtrl because it wasn't properly minified without it.
app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {
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
});
