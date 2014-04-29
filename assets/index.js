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
  .attr('height', 480)
  .append('g');

function redraw() {
  var polygon = svg
    .selectAll('polygon')
    .data(hexgrid.hexagons);

  polygon.enter().append('svg:polygon');

  polygon
    .attr('points', function(d, i) { return d.vertices.join(" "); })
    .classed('selected', function(hexagon) { return hexagon.selected; })
    .on('mousedown', function(hexagon) { hexagon.selected = true; redraw(); });
}

redraw();
