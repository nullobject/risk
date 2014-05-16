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
var countries = svg.append('g').attr('class', 'PiYG');
var regions = svg.append('g');

drawHexgrid();
drawCountries();
drawRegions();

function selectCountry(country, world) {
  console.log('select', country);
  world.selectedCountry = country;
  drawCountries();
}

function deselectCountry(country, world) {
  console.log('deselect', country);
  world.selectedCountry = null;
  drawCountries();
}

function move(from, to, world) {
  console.log('move', from, to);
  world.selectedCountry = null;
  drawCountries();
}

selections.withStateMachine(null, function(selectedCountry, event) {
  if (event.hasValue()) {
    var fn, country = event.value();

    if (selectedCountry && _.contains(selectedCountry.neighbours, country)) {
      // The user selected one of the nearby countries.
      fn = _.partial(move, selectedCountry, country);
      return [undefined, [new Bacon.Next(function() { return fn; })]];
    } else if (selectedCountry === country) {
      // The user selected the currently selected country.
      fn = _.partial(deselectCountry, country);
      return [undefined, [new Bacon.Next(function() { return fn; })]];
    } else {
      fn = _.partial(selectCountry, country);
      return [country, [new Bacon.Next(function() { return fn; })]];
    }
  } else {
    return [selectedCountry, [event]];
  }
}).onValue(function(fn) {
  // Call the partial function.
  fn(world);
});

function drawHexgrid() {
  hexgrid
    .selectAll('polygon')
    .data(world.hexagons)
    .enter().append('polygon')
    .attr('class', 'hexagon')
    .attr('points', function(d, i) { return d.toString(); });
}

function drawCountries() {
  var country = countries
    .selectAll('polygon')
    .data(world.countries);

  country.enter().append('polygon');

  country
    .attr('points', function(country, i) { return country.polygon.toString(); })
    .attr('class', function(country, i) { return 'cell q' + (i % 9) + '-9'; })
    .classed('selected', function(country) { return country === world.selectedCountry; })
    .classed('nearby', function(country) { return world.selectedCountry && _.contains(world.selectedCountry.neighbours, country); })
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
