var _ = require('lodash');
var clipper = require('./clipper');
var d3 = require('d3');
var Hexgrid = require('./hexgrid')

var RADIUS = 16,
    ROWS = 20,
    COLS = 20,
    PADDING = 0,
    SCALE = 100;

var hexgrid = new Hexgrid(COLS, ROWS, RADIUS, PADDING);

var hexagons = _.sample(hexgrid.hexagons, ROWS * COLS / 2);

var cpr = new clipper.Clipper();
    solutionPaths = [];

var subjectPaths = _.map(hexagons, function(hexagon) {
  var path = _.map(hexagon.vertices, function(vertex) {
    return {X: vertex[0], Y: vertex[1]};
  });
  clipper.JS.ScaleUpPath(path, SCALE);
  return path;
});

cpr.AddPaths(subjectPaths, clipper.PolyType.ptSubject, true);
var result = cpr.Execute(clipper.ClipType.ctUnion, solutionPaths, clipper.PolyFillType.pftNonZero, clipper.PolyFillType.pftNonZero);

var cells = _.map(solutionPaths, function(path) {
  clipper.JS.ScaleDownPath(path, SCALE);
  return _.map(path, function(point) {
    return [point.X, point.Y];
  });
});

var svg = d3
  .select('.container')
  .append('svg')
  .attr('width', 640)
  .attr('height', 480);

svg
  .append('g')
  .selectAll('polygon')
  .data(hexagons)
  .enter().append('svg:polygon')
  .attr('class', 'hexagon')
  .attr('points', function(d, i) { return d.vertices.join(' '); })
  .on('mousedown', function(hexagon) {
    d3.select(this).classed('selected', true)
  });

svg
  .append('g')
  .selectAll('polygon')
  .data(cells)
  .enter().append('svg:polygon')
  .attr('class', 'cell')
  .attr('points', function(d, i) { return d.join(' '); });
