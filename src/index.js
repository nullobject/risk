/** @jsx React.DOM */

var Bacon             = require('baconjs').Bacon;
var React             = require('react');
var WorldComponent    = require('./world_component');
var _                 = require('lodash');
var builder           = require('./builder');

var WIDTH = 640, HEIGHT = 480;
var world = builder.buildWorld(WIDTH, HEIGHT);
var selections = new Bacon.Bus();
var container = document.getElementsByClassName('container')[0];

selections.withStateMachine(null, function(selectedCountry, event) {
  if (event.hasValue()) {
    var fn, country = event.value();

    if (selectedCountry && _.contains(selectedCountry.neighbours, country)) {
      // The user selected one of the nearby countries.
      fn = _.partial(attackOrMove, selectedCountry, country);
      return [undefined, [new Bacon.Next(function() { return fn; })]];
    } else if (selectedCountry === country) {
      // The user selected the currently selected country.
      fn = _.partial(deselectCountry, country);
      return [undefined, [new Bacon.Next(function() { return fn; })]];
    } else {
      // The user selected a country.
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

var worldComponent = React.renderComponent(
  <WorldComponent world={world} stream={selections} />,
  container
);

function selectCountry(country, world) {
  console.log('select', country);
  worldComponent.selectCountry(country);
}

function deselectCountry(country, world) {
  console.log('deselect', country);
  worldComponent.selectCountry(null);
}

function attackOrMove(from, to, world) {
  console.log('attackOrMove', from, to);
  worldComponent.selectCountry(null);
}
