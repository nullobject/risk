/** @jsx React.DOM */

var _                 = require('lodash');
var Bacon             = require('baconjs').Bacon;
var PathsComponent    = require('./paths_component');
var PolygonsComponent = require('./polygons_component');
var React             = require('react');
var World             = require('./world');
var WorldComponent    = require('./world_component');

var width = 640, height = 480;
var world = new World(width, height);
var selections = new Bacon.Bus();
var container = document.getElementsByClassName('container')[0];

drawWorld();

function drawWorld() {
  React.renderComponent(
    <svg width={width} height={height}>
      <PolygonsComponent className="hexgrid" polygons={world.hexagons} />
      <WorldComponent className="PiYG" stream={selections} world={world} />
      <PathsComponent className="voronoi" paths={world.regions} />
    </svg>,
    container
  );
}

function selectCountry(country, world) {
  console.log('select', country);
  world.selectedCountry = country;
  drawWorld();
}

function deselectCountry(country, world) {
  console.log('deselect', country);
  world.selectedCountry = null;
  drawWorld();
}

function move(from, to, world) {
  console.log('move', from, to);
  world.selectedCountry = null;
  drawWorld();
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
