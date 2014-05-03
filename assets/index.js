var _ = require('lodash');
var d3 = require('d3');
var World = require('./world')

var RADIUS = 16,
    ROWS = 20,
    COLS = 20;

var world = new World(COLS, ROWS, RADIUS);

var svg = d3
  .select('.container')
  .append('svg')
  .attr('width', 640)
  .attr('height', 480);

svg
  .append('g')
  .selectAll('polygon')
  .data(world.hexagons)
  .enter().append('svg:polygon')
  .attr('class', 'hexagon')
  .attr('points', function(d, i) { return d.vertices.join(' '); })
  .on('mousedown', function(hexagon) {
    d3.select(this).classed('selected', true)
  });

svg
  .append('g')
  .selectAll('polygon')
  .data(world.cells)
  .enter().append('svg:polygon')
  .attr('class', 'cell')
  .attr('points', function(d, i) { return d.vertices.join(' '); });
