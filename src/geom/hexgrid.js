'use strict';

var Point   = require('./point'),
    Polygon = require('./polygon'),
    core    = require('../core');

// Calculates the position of a hexagon at a given coordinate.
function calculatePosition(coordinate, width, height) {
  var col = coordinate[0],
      row = coordinate[1];

  return Point(
    (col * width) + ((row % 2) * (width / 2)),
    row * height
  );
}

// Calculates the vertices of a hexagon at a given position.
function calculateVertices(position, r, h, radius) {
  return [
    Point(position.x,           position.y + h               ),
    Point(position.x + r,       position.y                   ),
    Point(position.x + (2 * r), position.y + h               ),
    Point(position.x + (2 * r), position.y + h + radius      ),
    Point(position.x + r,       position.y + (2 * h) + radius),
    Point(position.x,           position.y + h + radius      )
  ];
}

// Returns a new hexgrid with cells of a given radius.
//
// See http://www.redblobgames.com/grids/hexagons
module.exports = function(radius) {
  var padding = 0;

  // Precalculate values.
  var r = radius * Math.cos(core.degreesToRadians(30)),
      h = radius * Math.sin(core.degreesToRadians(30)),
      d = padding / 2 / Math.tan(core.degreesToRadians(30));

  // Calculate the dimensions of a hexagon.
  var width  = (2 * r) + padding,
      height = radius + h + d;

  // Calculates the vertices of a hexagon at a given coordinate.
  var hexagonVertices = function(origin, coordinate) {
    var position = calculatePosition(coordinate, width, height);
    return calculateVertices(origin.add(position), r, h, radius);
  };

  return {
    width:  width,
    height: height,

    // Returns an array of polygons which represent a hexgrid of a given size (rows
    // & cols).
    build: function(size, offset) {
      var cols = size[0],
          rows = size[1];

      // Generate the coordinates of the cells in the hexgrid.
      var coordinates = core.cartesianProduct(core.range(cols), core.range(rows));

      // Calculate the origin of the hexgrid.
      var origin = Point(
        width * offset[0],
        height * offset[1]
      );

      // Create haxagons for every coordinate.
      return coordinates.map(function(coordinate) {
        return Polygon(hexagonVertices(origin, coordinate));
      });
    },

    // Returns the number of hexgrid cells which fit in a rect of the given size.
    sizeForRect: function(width, height) {
      var cols = Math.floor(width / (2 * r)) - 1,
          rows = Math.floor(height / (radius + h)) - 1;

      return [cols, rows];
    }
  };
};
