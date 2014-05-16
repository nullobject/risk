var clipper = require('../lib/clipper');
var Point   = require('./point');
var Polygon = require('./polygon');

var SCALE = 100;

var PolygonSet = function(polygons) {
  this.polygons = polygons;
};

PolygonSet.prototype.constructor = PolygonSet;

// Merges the polygons in the set into a single polygon.
PolygonSet.prototype.merge = function() {
  var cpr = new clipper.Clipper(),
      solutionPaths = [];

  var subjectPaths = this.polygons.map(function(polygon) {
    var path = polygon.vertices.map(function(vertex) {
      return {X: vertex.x, Y: vertex.y};
    });

    clipper.JS.ScaleUpPath(path, SCALE);

    return path;
  });

  cpr.AddPaths(subjectPaths, clipper.PolyType.ptSubject, true);

  cpr.Execute(clipper.ClipType.ctUnion, solutionPaths, clipper.PolyFillType.pftNonZero, clipper.PolyFillType.pftNonZero);

  var vertices = solutionPaths.map(function(path) {
    clipper.JS.ScaleDownPath(path, SCALE);

    return path.map(function(point) {
      return new Point(point.X, point.Y);
    });
  })[0];

  return new Polygon(vertices);
};

module.exports = PolygonSet;
