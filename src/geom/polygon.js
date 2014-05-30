'use strict';

var Point   = require('./point');
var clipper = require('../../lib/clipper');

var SCALE = 100;

var Polygon = function(vertices) {
  var polygon = Object.create(Polygon.prototype);

  polygon.vertices = vertices;

  return polygon;
};

Polygon.prototype.constructor = Polygon;

// Returns the centroid of the polygon.
Polygon.prototype.centroid = function() {
  return this.vertices.reduce(function(sum, vertex) {
    return sum.add(vertex);
  }).divide(this.vertices.length);
};

// Ray-casting algorithm based on
// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
Polygon.prototype.containsPoint = function(point) {
  var inside = false;

  for (var i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
    var xi = this.vertices[i].x,
        yi = this.vertices[i].y,
        xj = this.vertices[j].x,
        yj = this.vertices[j].y;

    var intersect = ((yi > point.y) != (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
};

// Returns a new polygon which is offset from this polygon by a given delta.
Polygon.prototype.offset = function(delta) {
  var co = new clipper.ClipperOffset(),
      solution = [];

  var path = this.vertices.map(function(vertex) {
    return {X: vertex.x, Y: vertex.y};
  });

  clipper.JS.ScaleUpPath(path, SCALE);

  co.AddPath(path, clipper.JoinType.jtMiter, clipper.EndType.etClosedPolygon);

  co.Execute(solution, delta * SCALE);

  var vertices = solution.map(function(path) {
    clipper.JS.ScaleDownPath(path, SCALE);

    return path.map(function(point) {
      return Point(point.X, point.Y);
    });
  })[0];

  return Polygon(vertices);
};

Polygon.prototype.toString = function() {
  return this.vertices.join(' ');
};

// Merges the polygons in the set into a single polygon.
Polygon.merge = function(polygons) {
  var c = new clipper.Clipper(),
      solutionPaths = [];

  var subjectPaths = polygons.map(function(polygon) {
    var path = polygon.vertices.map(function(vertex) {
      return {X: vertex.x, Y: vertex.y};
    });

    clipper.JS.ScaleUpPath(path, SCALE);

    return path;
  });

  c.AddPaths(subjectPaths, clipper.PolyType.ptSubject, true);

  c.Execute(clipper.ClipType.ctUnion, solutionPaths, clipper.PolyFillType.pftNonZero, clipper.PolyFillType.pftNonZero);

  var vertices = solutionPaths.map(function(path) {
    clipper.JS.ScaleDownPath(path, SCALE);

    return path.map(function(point) {
      return Point(point.X, point.Y);
    });
  })[0];

  return Polygon(vertices);
};

module.exports = Polygon;
