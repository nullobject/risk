// var allong = require('./allong.es').allong.es;
var d3 = require('d3');
var Hexgrid = require('./hexgrid')

var RADIUS = 32,
    ROWS = 10,
    COLS = 10,
    PADDING = 0;

var hexgrid = new Hexgrid(COLS, ROWS, RADIUS, PADDING);

var svg = d3
  .select('.container')
  .append('svg')
  .attr('width', 640)
  .attr('height', 480);

var polygon = svg
  .append('g')
  .selectAll('polygon')
  .data(hexgrid.hexagons)
  .enter()
  .append('svg:polygon')
  .attr('points', function(d, i) { return d.vertices.join(' '); })
  .on('mousedown', function(hexagon) {
    d3.select(this).classed('selected', true)
  });
