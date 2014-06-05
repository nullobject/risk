'use strict';

var Bacon                   = require('baconjs').Bacon;
var CountryStateTransformer = require('./country_state_transformer');
var Game                    = require('./game');
var GameComponent           = require('./components/game_component.jsx');
var React                   = require('react');
var _                       = require('lodash');
var builder                 = require('./world_builder').build;
var core                    = require('./core');

// Calls the given function.
function call(fn) {
  fn();
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
    GameComponent({game: this.game, stream: bus}),
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

  // Assign the player property to the game component.
  playerProperty.assign(this.gameComponent, 'currentPlayer');

  // The player country property combines the player and country properties
  // into a tuple.
  var playerCountryProperty = Bacon.combineAsArray(playerProperty, countryProperty);

  playerCountryProperty
    .withStateMachine([null, null], this.handleEvent.bind(this))
    .onValue(call);
}

// Mixin the country state transformer.
_.extend(GameController.prototype, CountryStateTransformer);

GameController.prototype.selectCountry = function(country) {
  core.log('GameController#selectCountry', country);
  this.gameComponent.selectCountry(country);
};

GameController.prototype.deselectCountry = function() {
  core.log('GameController#deselectCountry');
  this.gameComponent.deselectCountry();
};

GameController.prototype.move = function(player, from, to) {
  core.log('GameController#move');
  this.gameComponent.deselectCountry();
  this.game.move(player, from, to);
};

GameController.prototype.constructor = GameController;

module.exports = GameController;
