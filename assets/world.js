var _ = require('lodash');
var clipper = require('./clipper');
var Hexgrid = require('./hexgrid')

var PADDING = 0,
    SCALE = 100;

function Cell(vertices) {
  this.vertices = vertices;
}

function World(cols, rows, radius) {
  var hexgrid = new Hexgrid(cols, rows, radius, PADDING);

  this.hexagons = _.sample(hexgrid.hexagons, cols * rows / 2);

  var cpr = new clipper.Clipper();
      solutionPaths = [];

  var subjectPaths = _.map(this.hexagons, function(hexagon) {
    var path = _.map(hexagon.vertices, function(vertex) {
      return {X: vertex[0], Y: vertex[1]};
    });
    clipper.JS.ScaleUpPath(path, SCALE);
    return path;
  });

  cpr.AddPaths(subjectPaths, clipper.PolyType.ptSubject, true);
  var result = cpr.Execute(clipper.ClipType.ctUnion, solutionPaths, clipper.PolyFillType.pftNonZero, clipper.PolyFillType.pftNonZero);

  this.cells = _.map(solutionPaths, function(path) {
    clipper.JS.ScaleDownPath(path, SCALE);
    var vertices = _.map(path, function(point) {
      return [point.X, point.Y];
    });
    return new Cell(vertices);
  });
}

module.exports = World;
