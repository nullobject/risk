var clipper = require('../lib/clipper');

var SCALE = 100;

var PolygonSet = function(polygons) {
  this.polygons = polygons;
};

PolygonSet.prototype.constructor = PolygonSet;

// Merges the polygons in the polygon set.
PolygonSet.prototype.merge = function() {
  var cpr = new clipper.Clipper(),
      solutionPaths = [];

  var subjectPaths = this.polygons.map(function(polygon) {
    var path = polygon.map(function(vertex) {
      return {X: vertex[0], Y: vertex[1]};
    });

    clipper.JS.ScaleUpPath(path, SCALE);

    return path;
  });

  cpr.AddPaths(subjectPaths, clipper.PolyType.ptSubject, true);

  cpr.Execute(clipper.ClipType.ctUnion, solutionPaths, clipper.PolyFillType.pftNonZero, clipper.PolyFillType.pftNonZero);

  return solutionPaths.map(function(path) {
    clipper.JS.ScaleDownPath(path, SCALE);

    return path.map(function(point) {
      return [point.X, point.Y];
    });
  })[0];
};

module.exports = PolygonSet;
