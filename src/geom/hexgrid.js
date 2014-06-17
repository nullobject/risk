'use strict';

var Point   = require('./point'),
    Polygon = require('./polygon'),
    _       = require('lodash'),
    core    = require('../core');

var Hexgrid = function(width, height, radius) {
  var r = radius * Math.cos(core.degreesToRadians(30)),
      h = radius * Math.sin(core.degreesToRadians(30));

  // Calculates the position of a hexagon at a given coordinate.
  function calculatePosition(coordinate) {
    var width  = 2 * r,
        height = radius + h,
        col    = coordinate[0],
        row    = coordinate[1];

    return Point(
      (col * width) + ((row % 2) * (width / 2)),
      row * height
    );
  }

  // Calculates the vertices of a hexagon at a given position.
  function calculateVertices(position) {
    return [
      Point(position.x,           position.y + h               ),
      Point(position.x + r,       position.y                   ),
      Point(position.x + (2 * r), position.y + h               ),
      Point(position.x + (2 * r), position.y + h + radius      ),
      Point(position.x + r,       position.y + (2 * h) + radius),
      Point(position.x,           position.y + h + radius      )
    ];
  }

  // Calculate the number of columns and rows.
  var cols = Math.floor(width / (2 * r)) - 1,
      rows = Math.floor(height / (radius + h)) - 1;

  // Generate the coordinates of the cells in the hexgrid.
  var coordinates = core.cartesianProduct(_.range(cols), _.range(rows));

  // Create haxagons for every coordinate.
  this.hexagons = coordinates.map(function(coordinate) {
    var position = calculatePosition(coordinate, radius),
        vertices = calculateVertices(position);
    return Polygon(vertices);
  });
};

module.exports = Hexgrid;
