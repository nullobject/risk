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

// Draw hexagons.
svg
  .append('g')
  .selectAll('polygon')
  .data(world.hexagons)
  .enter().append('svg:polygon')
  .attr('class', 'hexagon')
  .attr('points', function(d, i) { return d.join(' '); });

var neighbours = svg.append('g').selectAll('polygon');

function redrawNeighbours(cells) {
  neighbours = neighbours.data(cells);

  neighbours
    .enter().append('svg:polygon')
    .attr('points', function(d, i) { return d.join(' '); })
    .attr('class', 'cell neighbour')

  neighbours
    .exit().remove();
}

// Draw cells.
svg
  .append('g')
  .selectAll('polygon')
  .data(world.cells)
  .enter().append('svg:polygon')
  .attr('points', function(d, i) { return d.join(' '); })
  .attr('class', function(d, i) { return 'cell q' + (i % 9) + '-9'; })
  .on('mouseover', function(hexagon) {
    redrawNeighbours(hexagon.neighbours);
  })
  .on('mouseout', function() {
    redrawNeighbours([]);
  })
  .on('mousedown', function(hexagon) {
    d3.select(this).classed('selected', true)
  });

// Draw regions.
svg
  .append('g')
  .selectAll('path')
  .data(world.regions, polygon)
  .enter().append('path')
  .attr('d', polygon)
  .order();

// Draw links.
svg
  .append('g')
  .selectAll('line')
  .data(world.links)
  .enter().append('line')
  .attr('x1', function(d) { return d.source[0]; })
  .attr('y1', function(d) { return d.source[1]; })
  .attr('x2', function(d) { return d.target[0]; })
  .attr('y2', function(d) { return d.target[1]; });

function polygon(d) {
  return 'M' + d.join('L') + 'Z';
}
