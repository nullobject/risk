var _    = require('lodash');
var core = require('./core')
var d3   = require('d3');

var Polygon = function(vertices) {
  vertices.__proto__ = Polygon.prototype;

  // Cache the centroid of the polygon.
  vertices.centroid = d3.geom.polygon(_.clone(vertices)).centroid();

  return vertices;
};

Polygon.prototype = [];

// Ray-casting algorithm based on
// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
Polygon.prototype.containsPoint = function(point) {
  var x = point[0], y = point[1];
  var inside = false;

  for (var i = 0, j = this.length - 1; i < this.length; j = i++) {
    var xi = this[i][0], yi = this[i][1], xj = this[j][0], yj = this[j][1];
    var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
};

module.exports = Polygon;
