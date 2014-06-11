'use strict';

var Bacon                = require('baconjs').Bacon;
var Game                 = require('./game');
var GameComponent        = require('./components/game_component.jsx');
var GameStateTransformer = require('./game_state_transformer');
var React                = require('react');
var _                    = require('lodash');
var builder              = require('./world_builder').build;
var core                 = require('./core');

// Dispatches an action represented by a tuple to the given target. For
// example:
//
// ['move', player, country-a, country-b]
function dispatch(action, target) {
  var fn = target[_.head(action)];
  fn.apply(target, _.tail(action));
}

function GameController(options) {
  // Create and extend the bus.
  var bus = _.tap(new Bacon.Bus(), function(bus) {
    bus.ofType = function(type) {
      return this.filter(function(event) {
        return event.type == type;
      });
    };
  });

  // Create the game model.
  var game = this.game = new Game(options.width, options.height, builder);

  // Create the game component.
  this.gameComponent = React.renderComponent(
    GameComponent({game: game, stream: bus}),
    options.el
  );

  // The player property handles end-turn events to cycle through the players.
  var playerProperty = bus.ofType('end-turn').scan(0, function(index, event) {
    return (index + 1) % game.players.length;
  }).map(function(index) {
    return game.players[index];
  });

  // The country property handles select-country events to provide the selected
  // country.
  var countryProperty = bus.ofType('select-country').map('.country');

  // The player country property combines the player and country properties
  // into a tuple.
  var playerCountryProperty = Bacon.combineAsArray(playerProperty, countryProperty);

  // Apply the game state machine to the country player property and dispatch
  // the player's actions.
  //
  // See https://github.com/baconjs/bacon.js#observable-withstatemachine
  playerCountryProperty
    .withStateMachine([null, null], this.transformState.bind(this))
    .onValue(_.partialRight(dispatch, this));
}

// Mixin the state transformer.
_.extend(GameController.prototype, GameStateTransformer);

GameController.prototype.currentPlayer = function(player) {
  core.log('GameController#currentPlayer', player);
  this.gameComponent.currentPlayer(player);
};

GameController.prototype.selectedCountry = function(country) {
  core.log('GameController#selectedCountry', country);
  this.gameComponent.selectedCountry(country);
  // TODO: Play sound.
};

GameController.prototype.move = function(player, from, to) {
  core.log('GameController#move');

  if (this.game.move(player, from, to)) {
    // TODO: Play sound.
  } else {
    // TODO: Play sound.
  }
};

GameController.prototype.constructor = GameController;

module.exports = GameController;
