var d3 = require('d3');
var World = require('./world')

// SVG dimensions.
var width = 640, height = 480;

var world = new World(width, height);

var svg = d3
  .select('.container')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

svg
  .append('g')
  .selectAll('polygon')
  .data(world.hexagons)
  .enter().append('svg:polygon')
  .attr('class', 'hexagon')
  .attr('points', function(d, i) { return d.join(' '); });

svg
  .append('g')
  .selectAll('polygon')
  .data(world.cells)
  .enter().append('svg:polygon')
  .attr('points', function(d, i) { return d.join(' '); })
  .attr('class', function(d, i) { return 'cell q' + (i % 9) + '-9'; })
  .on('mousedown', function(hexagon) {
    d3.select(this).classed('selected', true)
  });

svg
  .append('g')
  .selectAll('path')
  .data(world.regions, polygon)
  .enter().append('path')
  .attr('d', polygon)
  .order();

function polygon(d) {
  return 'M' + d.join('L') + 'Z';
}
