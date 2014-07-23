'use strict';

var Point   = require('./point'),
    clipper = require('../../lib/clipper');

var SCALE = 100;

// Converts a given polygon to a clipper path.
function toPath(polygon) {
  var path = polygon.vertices.map(function(point) {
    return {X: point.x, Y: point.y};
  });

  clipper.JS.ScaleUpPath(path, SCALE);

  return path;
}

// Converts a given clipper path to a polygon.
function toPolygon(path) {
  clipper.JS.ScaleDownPath(path, SCALE);

  var vertices = path.map(function toPoint(vertex) {
    return Point(vertex.X, vertex.Y);
  });

  return Polygon(vertices);
}

// Returns a new polygon with the given vertices.
var Polygon = function(vertices) {
  return {
    vertices: vertices,

    // Returns the centroid of the polygon.
    centroid: function() {
      return this.vertices.reduce(function(sum, vertex) {
        return sum.add(vertex);
      }, Point.zero()).divide(this.vertices.length);
    },

    // Returns true if the polygon contains a given point.
    //
    // See http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    containsPoint: function(point) {
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
    },

    // Returns a new polygon which is offset from this polygon by a given delta.
    //
    // See http://jsclipper.sourceforge.net/6.1.3.2/
    offset: function(delta) {
      var co = new clipper.ClipperOffset(),
          solutionPaths = [];

      // Convert the polygon to a path.
      var subjectPath = toPath(this);

      // Add the path.
      co.AddPath(subjectPath, clipper.JoinType.jtMiter, clipper.EndType.etClosedPolygon);

      // Run clipper.
      co.Execute(solutionPaths, delta * SCALE);

      // Return a new polygon.
      return toPolygon(solutionPaths[0]);
    },

    toString: function() {
      return this.vertices.join(' ');
    }
  };
};

// Merges the given polygons into a new polygon.
//
// See http://jsclipper.sourceforge.net/6.1.3.2/
Polygon.merge = function(polygons) {
  var c = new clipper.Clipper(),
      solutionPaths = [];

  // Convert the polygons to paths.
  var subjectPaths = polygons.map(toPath);

  // Add the paths.
  c.AddPaths(subjectPaths, clipper.PolyType.ptSubject, true);

  // Run clipper.
  c.Execute(clipper.ClipType.ctUnion, solutionPaths, clipper.PolyFillType.pftNonZero, clipper.PolyFillType.pftNonZero);

  // Return a new polygon.
  return toPolygon(solutionPaths[0]);
};

module.exports = Polygon;
