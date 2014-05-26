'use strict';


function dispatch(fn) {
var Bacon                   = require('baconjs').Bacon;
var Game                    = require('./game');
var GameComponent           = require('./game_component.jsx');
var React                   = require('react');
var _                       = require('lodash');
  fn();
}

function state(newState, fn) {
  return [newState, [new Bacon.Next(function() { return fn; })]];
}

function GameController(options) {
  var countryStream = new Bacon.Bus();

  countryStream
    .withStateMachine(null, this.stateTransform.bind(this))
    .onValue(dispatch);

  this.game = new Game(options.width, options.height);

  this.gameComponent = React.renderComponent(
    GameComponent({game: this.game, stream: countryStream}),
    options.el
  );
}

// The state transformation function for the country stream.
GameController.prototype.stateTransform = function(previousCountry, event) {
  if (event.hasValue()) {
    var fn, nextCountry = event.value();

    if (previousCountry && _.contains(previousCountry.neighbours, nextCountry)) {
      // The user selected one of the nearby countries.
      fn = this.attackOrMove.bind(this, previousCountry, nextCountry);
      return state(undefined, fn);
    } else if (previousCountry === nextCountry) {
      // The user selected the previously selected country.
      fn = this.deselectCountry.bind(this, nextCountry);
      return state(undefined, fn);
    } else {
      // The user selected a new country.
      fn = this.selectCountry.bind(this, nextCountry);
      return state(nextCountry, fn);
    }
  } else {
    return [previousCountry, [event]];
  }
};

GameController.prototype.selectCountry = function(country) {
  console.log('select', country);
  this.gameComponent.selectCountry(country);
};

GameController.prototype.deselectCountry = function(country) {
  console.log('deselect', country);
  this.gameComponent.deselectCountry();
};

GameController.prototype.attackOrMove = function(source, target) {
  console.log('attackOrMove', source, target);
  this.gameComponent.deselectCountry();
  // TODO: Figure out if we're moving or attacking.
  this.game.world.move(source, target);
};

GameController.prototype.constructor = GameController;

module.exports = GameController;
