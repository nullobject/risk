var _     = require('lodash');
var d3    = require('d3');
var Bacon = require('baconjs').Bacon;
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

// Draw countries.
var selections = new Bacon.Bus();

var countries = svg.append('g');

function drawCountries(selectedCountry) {
  var country = countries
    .selectAll('polygon')
    .data(world.countries);

  // country.enter().append('g');
  country.enter().append('polygon');

  country
    .attr('points', function(country, i) { return country.join(' '); })
    .attr('class', function(country, i) { return 'cell q' + (i % 9) + '-9'; })
    .classed('selected', function(country) { return country === selectedCountry; })
    .classed('nearby', function(country) { return selectedCountry && _.contains(selectedCountry.neighbours, country); })
    .on('mousedown', function(country) { selections.push(country); });

  // country
  //   .append('text')
  //   .attr('transform', function(country) {
  //     var centroid = calculateCentroid(this.previousSibling);
  //     return 'translate(' + centroid[0] + ',' + centroid[1] + ')';
  //   })
  //   .text(function(country) { return country.armies; });
}

selections.scan(null, function(a, b) {
  // Toggle the selection if the same country is selected.
  return a === b ? null : b;
}).onValue(drawCountries);

drawCountries(null);

// function calculateCentroid(selection) {
//   var bbox = selection.getBBox();
//   return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
// }

// Draw regions.
// svg
//   .append('g')
//   .selectAll('path')
//   .data(world.regions, polygon)
//   .enter().append('path')
//   .attr('class', 'voronoi')
//   .attr('d', polygon)
//   .order();

// function polygon(d) {
//   return 'M' + d.join('L') + 'Z';
// }
