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
      fn = attackOrMove.bind(this, selectedCountry, country);
      return [undefined, [new Bacon.Next(function() { return fn; })]];
    } else if (selectedCountry === country) {
      // The user selected the currently selected country.
      fn = deselectCountry.bind(this, country);
      return [undefined, [new Bacon.Next(function() { return fn; })]];
    } else {
      // The user selected a country.
      fn = selectCountry.bind(this, country);
      return [country, [new Bacon.Next(function() { return fn; })]];
    }
  } else {
    return [selectedCountry, [event]];
  }
}).onValue(function(fn) {
  fn();
});

var worldComponent = React.renderComponent(
  <WorldComponent world={world} stream={selections} />,
  container
);

function selectCountry(country) {
  console.log('select', country);
  worldComponent.selectCountry(country);
}

function deselectCountry(country) {
  console.log('deselect', country);
  worldComponent.selectCountry(null);
}

function attackOrMove(source, target) {
  console.log('attackOrMove', source, target);
  worldComponent.selectCountry(null);
  // TODO: Figure out if we're moving or attacking.
  world.move(source, target);
}
