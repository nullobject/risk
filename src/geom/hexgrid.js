'use strict';

var F       = require('fkit'),
    Point   = require('./point'),
    Polygon = require('./polygon');

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * Calculates the position of a hexagon at a given coordinate.
 */
function calculatePosition(coordinate, width, height) {
  var col = coordinate[0],
      row = coordinate[1];

  return Point(
    (col * width) + ((row % 2) * (width / 2)),
    row * height
  );
}

/**
 * Calculates the vertices of a hexagon at a given position.
 */
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

/**
 * Returns a new hexgrid with cells of a given radius.
 *
 * See http://www.redblobgames.com/grids/hexagons
 */
module.exports = function(radius) {
  var padding = 0;

  // Precalculate values.
  var r = radius * Math.cos(degreesToRadians(30)),
      h = radius * Math.sin(degreesToRadians(30)),
      d = padding / 2 / Math.tan(degreesToRadians(30));

  // Calculate the dimensions of a hexagon.
  var width  = (2 * r) + padding,
      height = radius + h + d;

  // Calculates the vertices of a hexagon at a given coordinate.
  var hexagonVertices = F.curry(function(origin, coordinate) {
    var position = calculatePosition(coordinate, width, height);
    return calculateVertices(origin.add(position), r, h, radius);
  });

  return {
    width:  width,
    height: height,

    /**
     * Returns an array of polygons which represent a hexgrid of a given size
     * (rows & cols).
     */
    build: function(size, offset) {
      // Generate the coordinates of the cells in the hexgrid.
      var coordinates = F.cartesian(F.range(0, size[0]), F.range(0, size[1]));

      // Calculate the origin of the hexgrid.
      var origin = Point(width * offset[0], height * offset[1]);

      // Create haxagons for every coordinate.
      return coordinates.map(F.compose(Polygon, hexagonVertices(origin)));
    },

    /**
     * Returns the number of hexgrid cells which fit in a rect of the given
     * size.
     */
    sizeForRect: function(width, height) {
      var cols = Math.floor(width / (2 * r)) - 1,
          rows = Math.floor(height / (radius + h)) - 1;

      return [cols, rows];
    }
  };
};
