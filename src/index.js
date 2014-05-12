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

function redrawNeighbours(countries) {
  neighbours = neighbours.data(countries);

  neighbours
    .enter().append('svg:polygon')
    .attr('points', function(d, i) { return d.join(' '); })
    .attr('class', 'cell neighbour')

  neighbours
    .exit().remove();
}

// Draw countries.
svg
  .append('g')
  .selectAll('polygon')
  .data(world.countries)
  .enter().append('svg:polygon')
  .attr('points', function(d, i) { return d.join(' '); })
  .attr('class', function(d, i) { return 'cell q' + (i % 9) + '-9'; })
  .on('mouseover', function(country) {
    redrawNeighbours(country.neighbours);
  })
  .on('mouseout', function() {
    redrawNeighbours([]);
  })
  .on('mousedown', function(country) {
    d3.select(this).classed('selected', true)
  });

// Draw regions.
svg
  .append('g')
  .selectAll('path')
  .data(world.regions, polygon)
  .enter().append('path')
  .attr('class', 'voronoi')
  .attr('d', polygon)
  .order();

function polygon(d) {
  return 'M' + d.join('L') + 'Z';
}
