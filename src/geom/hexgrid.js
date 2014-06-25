'use strict';

var Point   = require('./point'),
    Polygon = require('./polygon'),
    _       = require('lodash'),
    core    = require('../core');

// The Hexgrid class builds a hexgrid with cells of a given size.
//
// See http://www.redblobgames.com/grids/hexagons
var Hexgrid = function(size) {
  this.size    = size;
  this.padding = 0;

  // Precalculate values.
  this.r = this.size * Math.cos(core.degreesToRadians(30));
  this.h = this.size * Math.sin(core.degreesToRadians(30));
  this.d = this.padding / 2 / Math.tan(core.degreesToRadians(30));

  // Calculate the dimensions of a hexagon.
  this.width  = (2 * this.r) + this.padding;
  this.height = this.size + this.h + this.d;
};

Hexgrid.prototype.constructor = Hexgrid;

// Returns an array of polygons which represent a hexgrid of a given size (rows
// & cols).
Hexgrid.prototype.build = function(size, offset) {
  var cols = size[0],
      rows = size[1];

  // Generate the coordinates of the cells in the hexgrid.
  var coordinates = core.cartesianProduct(_.range(cols), _.range(rows));

  // Calculate the origin of the hexgrid.
  var origin = Point(
    this.width * offset[0],
    this.height * offset[1]
  );

  // Create haxagons for every coordinate.
  return coordinates.map(function(coordinate) {
    var position = this.calculatePosition(coordinate),
        vertices = this.calculateVertices(origin.add(position));

    return Polygon(vertices);
  }, this);
};

// Returns the number of hexgrid cells which fit in a rect of the given size.
Hexgrid.prototype.sizeForRect = function(width, height) {
  var cols = Math.floor(width / (2 * this.r)) - 1,
      rows = Math.floor(height / (this.size + this.h)) - 1;

  return [cols, rows];
};

// Calculates the position of a hexagon at a given coordinate.
Hexgrid.prototype.calculatePosition = function(coordinate) {
  var col = coordinate[0],
      row = coordinate[1];

  return Point(
    (col * this.width) + ((row % 2) * (this.width / 2)),
    row * this.height
  );
};

// Calculates the vertices of a hexagon at a given position.
Hexgrid.prototype.calculateVertices = function(position) {
  return [
    Point(position.x,                position.y + this.h                  ),
    Point(position.x + this.r,       position.y                           ),
    Point(position.x + (2 * this.r), position.y + this.h                  ),
    Point(position.x + (2 * this.r), position.y + this.h + this.size      ),
    Point(position.x + this.r,       position.y + (2 * this.h) + this.size),
    Point(position.x,                position.y + this.h + this.size      )
  ];
};

module.exports = Hexgrid;
