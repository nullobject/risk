var _    = require('lodash');
var clipper = require('../lib/clipper');
var core = require('./core');
var d3   = require('d3');

var SCALE = 100;

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

// Offsets the polygon by a given delta.
Polygon.prototype.offset = function(delta) {
  var co = new clipper.ClipperOffset(),
      solution = [];

  var path = this.map(function(vertex) {
    return {X: vertex[0], Y: vertex[1]};
  });

  clipper.JS.ScaleUpPath(path, SCALE);

  co.AddPath(path, clipper.JoinType.jtMiter, clipper.EndType.etClosedPolygon);

  co.Execute(solution, delta * SCALE);

  return solution.map(function(path) {
    clipper.JS.ScaleDownPath(path, SCALE);

    return path.map(function(point) {
      return [point.X, point.Y];
    });
  })[0];
};

module.exports = Polygon;
