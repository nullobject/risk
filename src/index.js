var _     = require('lodash');
var d3    = require('d3');
var Bacon = require('baconjs').Bacon;
var World = require('./world');

var width = 640, height = 480;
var world = new World(width, height);
var selections = new Bacon.Bus();

var svg = d3
  .select('.container')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

var hexgrid = svg.append('g');
var countries = svg.append('g');
var regions = svg.append('g');

drawHexgrid();
drawCountries(null);
drawRegions();

// TODO: If the country is a nearby country of the currently selected country,
// then trigger a 'move' event. Otherwise, trigger a 'select' event.
selections.scan(null, function(a, b) {
  // Toggle the selection if the same country is selected.
  return a === b ? null : b;
}).onValue(drawCountries);

function drawHexgrid() {
  hexgrid
    .selectAll('polygon')
    .data(world.hexagons)
    .enter().append('polygon')
    .attr('class', 'hexagon')
    .attr('points', function(d, i) { return d.join(' '); });
}

function drawCountries(selectedCountry) {
  var country = countries
    .selectAll('polygon')
    .data(world.countries);

  country.enter().append('polygon');

  country
    .attr('points', function(country, i) { return country.join(' '); })
    .attr('class', function(country, i) { return 'cell q' + (i % 9) + '-9'; })
    .classed('selected', function(country) { return country === selectedCountry; })
    .classed('nearby', function(country) { return selectedCountry && _.contains(selectedCountry.neighbours, country); })
    .on('click', function(country) { selections.push(country); });
}

function drawRegions() {
  regions
    .selectAll('path')
    .data(world.regions, polygon)
    .enter().append('path')
    .attr('class', 'voronoi')
    .attr('d', polygon)
    .order();
}

function polygon(d) {
  return 'M' + d.join('L') + 'Z';
}
