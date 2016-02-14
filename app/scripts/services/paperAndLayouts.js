// Copyright 2014 John Munsch
angular.module('PaperQuikApp').factory('rendering', function() {
  'use strict';

  ////////////////////////////////////////////////////////////////////////////////
  // Drawing functions
  ////////////////////////////////////////////////////////////////////////////////
  function drawOutline(area, fill, options) {
    var pixels = fill.pixels;

    var rectangle = new Rectangle(
        new Point(pixels(area.x), pixels(area.y)),
        new Size(pixels(area.width), pixels(area.height)));

    var path = new Path.Rectangle(rectangle);
    path.strokeColor = options.outlineColor;
    path.strokeWidth = options.outlineWidth;
  }

  function drawHeader(area, fill, options) {
    var verticalLineLocation = 0.20 * area.width;
    var gap = 1.5;
    var pixels = fill.pixels;

    var boundaryLines = new CompoundPath();
    boundaryLines.moveTo(pixels(area.x), pixels(area.y));
    boundaryLines.lineTo(pixels(area.x + area.width), pixels(area.y));

    boundaryLines.moveTo(pixels(area.x), pixels(area.y + area.height));
    boundaryLines.lineTo(pixels(area.x + area.width), pixels(area.y + area.height));

    boundaryLines.moveTo(pixels(area.x + verticalLineLocation), pixels(area.y + gap));
    boundaryLines.lineTo(pixels(area.x + verticalLineLocation), pixels(area.y + area.height - gap));

    boundaryLines.strokeColor = options.headerColor;
    boundaryLines.strokeWidth = options.headerWidth;

    // Need to figure out text positioning.
    var text = new PointText(new Point(pixels(area.x + 2), pixels(area.y + 4)));
    text.fillColor = options.headerColor;
    text.fontSize = '20pt';
    text.content = 'Date/Number';

    text = new PointText(new Point(pixels(area.x + verticalLineLocation + 2), pixels(area.y + 4)));
    text.fillColor = options.headerColor;
    text.fontSize = '20pt';
    text.content = 'Title/Subject';
  }

  function drawFooter(area, fill) {
    var pixels = fill.pixels;

    var raster = new Raster('logo');

    // Move the raster to the center of the view
    raster.opacity = 0.8;
    raster.scale(0.5);
    raster.position = new Point(pixels(area.right) + (raster.size.width / 2) - 300,
            pixels(area.top) + (raster.size.height / 2) + 3);
  }

  function drawBlank(area, fill, options) {
    var adjustedAreas = adjustForHeader(area);

    drawHeader(adjustedAreas.header, fill, options);
    drawOutline(adjustedAreas.area, fill, options);
    drawFooter(adjustedAreas.footer, fill);
  }

  function drawDotGrid(area, fill, options) {
    var adjustedAreas = adjustForHeader(area);

    drawHeader(adjustedAreas.header, fill, options);
    drawOutline(adjustedAreas.area, fill, options);
    drawFooter(adjustedAreas.footer, fill);

    var pixels = fill.pixels;
    var fillArea = adjustedAreas.area;

    for (var x = (fillArea.x + options.dotSpacing);
         x < (fillArea.x + fillArea.width);
         x += options.dotSpacing) {
      for (var y = (fillArea.y + options.dotSpacing);
           y < (fillArea.y + fillArea.height);
           y += options.dotSpacing) {
        var shape = new Shape.Circle(new Point(pixels(x), pixels(y)), options.dotRadius);
        shape.fillColor = options.dotColor;
      }
    }
  }

  function drawDottedRuledLines(area, fill, options) {
    options.dotSpacing = options.ruleSize;

    drawDotGrid(area, fill, options);
    drawRuledLines(area, fill, options);
  }

  function drawRuledLines(area, fill, options) {
    var adjustedAreas = adjustForHeader(area);

    drawHeader(adjustedAreas.header, fill, options);
    drawOutline(adjustedAreas.area, fill, options);
    drawFooter(adjustedAreas.footer, fill);

    var pixels = fill.pixels;
    var fillArea = adjustedAreas.area;

    var horizontalLines = new CompoundPath();
    for (var y = (fillArea.y + options.ruleSize);
         y < (fillArea.y + fillArea.height);
         y += options.ruleSize) {
      horizontalLines.moveTo(pixels(fillArea.x), pixels(y));
      horizontalLines.lineTo(pixels(fillArea.x + fillArea.width), pixels(y));
    }

    horizontalLines.strokeColor = options.ruleColor;
    horizontalLines.strokeWidth = options.ruleWidth;
  }

  function drawSquareGraph(area, fill, options) {
    var adjustedAreas = adjustForHeader(area);

    drawHeader(adjustedAreas.header, fill, options);
    drawOutline(adjustedAreas.area, fill, options);
    drawFooter(adjustedAreas.footer, fill);

    var pixels = fill.pixels;
    var fillArea = adjustedAreas.area;

    var verticalLines = new CompoundPath();
    for (var x = fillArea.x + options.lineSpacing; x < (fillArea.x + fillArea.width); x += options.lineSpacing) {
      verticalLines.moveTo(pixels(x), pixels(fillArea.y));
      verticalLines.lineTo(pixels(x), pixels(fillArea.y + fillArea.height));
    }

    verticalLines.strokeColor = options.lineColor;
    verticalLines.strokeWidth = options.lineWidth;

    var horizontalLines = new CompoundPath();
    for (var y = fillArea.y + options.lineSpacing; y < (fillArea.y + fillArea.height); y += options.lineSpacing) {
      horizontalLines.moveTo(pixels(fillArea.x), pixels(y));
      horizontalLines.lineTo(pixels(fillArea.x + fillArea.width), pixels(y));
    }

    horizontalLines.strokeColor = options.lineColor;
    horizontalLines.strokeWidth = options.lineWidth;
  }

  var colors = {
    'Black' : '#000000',
    'Non-Photo Blue' : '#A4DDED'
  };

  var ruleSizes = {
    'Wide Ruled (AKA Legal Ruled)' : 8.7,
    'Medium Ruled (AKA College Ruled)' : 7.1,
    'Narrow Ruled' : 6.35,
    '8mm' : 8,
    '7mm' : 7,
    '6mm' : 6
  };

  var availableFills = {
    blank: {
      name: 'Blank',
      render: drawBlank,

      // No horizontal or vertical pattern size.

      defaults: {
        outline: true,
        outlineColor: colors.Black,
        outlineWidth: 1,

        headerColor: colors.Black,
        headerWidth: 1
      }
    },
    dotGrid: {
      name: 'Dot Grid',
      render: drawDotGrid,

      horizontalPatternSize: function (options) {
        return options.dotSpacing || this.defaults.dotSpacing;
      },
      verticalPatternSize: function (options) {
        return options.dotSpacing || this.defaults.dotSpacing;
      },

      defaults: {
        outline: true,
        outlineColor: colors.Black,
        outlineWidth: 1,

        headerColor: colors.Black,
        headerWidth: 1,

        dotSpacing: 5,
        availableDotSpacings: ruleSizes,
        dotColor: colors.Black,
        availableDotColors: colors,
        dotRadius: 2.5
      }
    },
    dottedRuledLines: {
      name: 'Dotted Ruled Lines',
      render: drawDottedRuledLines,

      horizontalPatternSize: function (options) {
        return options.ruleSize || this.defaults.ruleSize;
      },
      verticalPatternSize: function (options) {
        return options.ruleSize || this.defaults.ruleSize;
      },

      defaults: {
        outline: true,
        outlineColor: colors.Black,
        outlineWidth: 1,

        headerColor: colors.Black,
        headerWidth: 1,

        dotColor: colors.Black,
        availableDotColors: colors,
        dotRadius: 2.2,

        ruleSize: 7,
        availableRuleSizes: ruleSizes,
        ruleColor: colors.Black,
        availableRuleColors: colors,
        ruleWidth: 1
      }
    },
    ruledLines: {
      name: 'Ruled Lines',
      render: drawRuledLines,

      verticalPatternSize: function (options) {
        return options.ruleSize || this.defaults.ruleSize;
      },

      defaults: {
        outline: true,
        outlineColor: colors.Black,
        outlineWidth: 1,

        headerColor: colors.Black,
        headerWidth: 1,

        ruleSize: 7,
        availableRuleSizes: ruleSizes,
        ruleColor: colors.Black,
        availableRuleColors: colors,
        ruleWidth: 1
      }
    },
    squareGraph: {
      name: 'Square Graph',
      render: drawSquareGraph,

      horizontalPatternSize: function (options) {
        return options.lineSpacing || this.defaults.lineSpacing;
      },
      verticalPatternSize: function (options) {
        return options.lineSpacing || this.defaults.lineSpacing;
      },

      defaults: {
        outline: true,
        outlineColor: colors.Black,
        outlineWidth: 1,

        headerColor: colors.Black,
        headerWidth: 1,

        lineSpacing: 7,
        availableLineSpacings: ruleSizes,
        lineColor: colors.Black,
        availableLineColors: colors,
        lineWidth: 1
      }
    }
  };

  function fullPage(paper) {
    return new Rectangle(0, 0, paper.width, paper.height);
  }

  function adjustForHeader(originalArea) {
    var headerHeight = 15;
    var gap = 3;

    return {
      header: new Rectangle(originalArea.x, originalArea.y, originalArea.width, headerHeight),
      area: new Rectangle(originalArea.x, originalArea.y + (headerHeight + gap), originalArea.width,
              originalArea.height - (headerHeight + gap)),
      footer: new Rectangle(originalArea.x, originalArea.y + originalArea.height, originalArea.width, 50)
    };
  }

  // All measurements are in mm and IDs are just randomly generated here:
  // http://www.dave-reed.com/csc107.F03/Labs/randSeq.html
  // from this set of letters: abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789
  // Next IDs: tfdB PVM2 BQ6a d5z3 mrW3 hG2P LS5V SLPw gCJH jBZ7 CdCb yuLG sKgC fFSU WCgc
  return {
    fills : availableFills,
    paperAndLayouts : [
      {
        id: 'letter',
        name: 'Letter',
        width: 215.9,
        height: 279.4,
        layouts : [
          {
            id: 'h3FU',
            name: 'Blank',
            image: 'images/Blank-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.blank // ,
//                overrides: {
//                }
              }
            ]
          },
          {
            id: 'kYpx',
            name: 'Dot Grid',
            image: 'images/Dot-Grid-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dotGrid
              }
            ]
          },
          {
            id: 'febN',
            name: 'Dotted Ruled Lines',
            image: 'images/Dotted-Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dottedRuledLines
              }
            ]
          },
          {
            id: 'a46K',
            name: 'Ruled Lines',
            image: 'images/Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.ruledLines
              }
            ]
          },
          {
            id: 'H7db',
            name: 'Square Graph',
            image: 'images/Square-Graph-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.squareGraph
              }
            ]
          }
        ]
      },
      {
        id: 'letterl',
        name: 'Letter',
        width: 279.4,
        height: 215.9,
        layouts: [
          {
            id: '2GdM',
            name: 'Blank',
            image: 'images/Blank-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.blank
              }
            ]
          },
          {
            id: 'TKkJ',
            name: 'Dot Grid',
            image: 'images/Dot-Grid-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dotGrid
              }
            ]
          },
          {
            id: 'jkBP',
            name: 'Dotted Ruled Lines',
            image: 'images/Dotted-Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dottedRuledLines
              }
            ]
          },
          {
            id: 'cX4M',
            name: 'Ruled Lines',
            image: 'images/Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.ruledLines
              }
            ]
          },
          {
            id: 'VqM',
            name: 'Square Graph',
            image: 'images/Square-Graph-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.squareGraph
              }
            ]
          }
        ]
      },
      {
        id: 'legal',
        name: 'Legal',
        width: 215.9,
        height: 355.6,
        layouts: [
          {
            id: 'XE8',
            name: 'Blank',
            image: 'images/Blank-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.blank
              }
            ]
          },
          {
            id: 'gMU',
            name: 'Dot Grid',
            image: 'images/Dot-Grid-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dotGrid
              }
            ]
          },
          {
            id: 'w8L',
            name: 'Dotted Ruled Lines',
            image: 'images/Dotted-Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dottedRuledLines
              }
            ]
          },
          {
            id: 'DLc',
            name: 'Ruled Lines',
            image: 'images/Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.ruledLines
              }
            ]
          },
          {
            id: 'PmV',
            name: 'Square Graph',
            image: 'images/Square-Graph-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.squareGraph
              }
            ]
          }
        ]
      },
      {
        id: 'a4',
        name: 'A4',
        width: 210.0,
        height: 297.0,
        layouts : [
          {
            id: 'zpa',
            name: 'Blank',
            image: 'images/Blank-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.blank
              }
            ]
          },
          {
            id: 'nz3',
            name: 'Dot Grid',
            image: 'images/Dot-Grid-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dotGrid
              }
            ]
          },
          {
            id: 'wXN',
            name: 'Dotted Ruled Lines',
            image: 'images/Dotted-Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dottedRuledLines
              }
            ]
          },
          {
            id: 'wAB',
            name: 'Ruled Lines',
            image: 'images/Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.ruledLines
              }
            ]
          },
          {
            id: 'GLy',
            name: 'Square Graph',
            image: 'images/Square-Graph-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.squareGraph
              }
            ]
          }
        ]
      },
      {
        id: 'a4l',
        name: 'A4',
        width: 297.0,
        height: 210.0,
        layouts: [
          {
            id: 'Hk8',
            name: 'Blank',
            image: 'images/Blank-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.blank
              }
            ]
          },
          {
            id: 'hJX',
            name: 'Dot Grid',
            image: 'images/Dot-Grid-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dotGrid
              }
            ]
          },
          {
            id: 'hDG',
            name: 'Dotted Ruled Lines',
            image: 'images/Dotted-Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dottedRuledLines
              }
            ]
          },
          {
            id: 'BQV',
            name: 'Ruled Lines',
            image: 'images/Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.ruledLines
              }
            ]
          },
          {
            id: '5gS',
            name: 'Square Graph',
            image: 'images/Square-Graph-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.squareGraph
              }
            ]
          }
        ]
      },
      {
        id: 'a5',
        name: 'A5',
        width: 148,
        height: 210,
        layouts: [
          {
            id: '3gK',
            name: 'Blank',
            image: 'images/Blank-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.blank
              }
            ]
          },
          {
            id: 'fJ9',
            name: 'Dot Grid',
            image: 'images/Dot-Grid-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dotGrid
              }
            ]
          },
          {
            id: 't6T',
            name: 'Dotted Ruled Lines',
            image: 'images/Dotted-Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.dottedRuledLines
              }
            ]
          },
          {
            id: 'gKz',
            name: 'Ruled Lines',
            image: 'images/Ruled-Lines-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.ruledLines
              }
            ]
          },
          {
            id: 'v9g',
            name: 'Square Graph',
            image: 'images/Square-Graph-Paper.jpg',
            areas: [
              {
                name: 'Body',
                dimensions: fullPage,
                fill: availableFills.squareGraph
              }
            ]
          }
        ]
      }
    ]
  };
});
