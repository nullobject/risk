'use strict';

var Bacon                   = require('baconjs').Bacon;
var CountryStateTransformer = require('./country_state_transformer');
var Game                    = require('./game');
var GameComponent           = require('./components/game_component.jsx');
var React                   = require('react');
var _                       = require('lodash');
var builder                 = require('./world_builder').build;

// Calls the given function.
function call(fn) {
  fn();
}

function GameController(options) {
  var game = this.game = new Game(options.width, options.height, builder);

  var stream = new Bacon.Bus();

  stream.ofType = function(type) {
    return this.filter(function(event) {
      return event.type == type;
    });
  };

  // The player property cycles through the players on end-turn events.
  var player = stream.ofType('end-turn').scan(0, function(index, event) {
    return (index + 1) % game.players.length;
  }).map(function(index) {
    return game.players[index];
  });

  var country = stream.ofType('select-country').map(".country");

  // Combine the player and country properties into a tuple.
  var playerCountries = Bacon.combineAsArray(player, country);

  playerCountries
    .withStateMachine(null, this.handleEvent.bind(this))
    .onValue(call);

  this.gameComponent = React.renderComponent(
    GameComponent({game: this.game, stream: stream}),
    options.el
  );
}

// Mixin the country state transformer.
_.extend(GameController.prototype, CountryStateTransformer);

GameController.prototype.selectCountry = function(country) {
  console.log('GameController#selectCountry', country);
  this.gameComponent.selectCountry(country);
};

GameController.prototype.deselectCountry = function() {
  console.log('GameController#deselectCountry');
  this.gameComponent.deselectCountry();
};

GameController.prototype.move = function(player, from, to) {
  console.log('GameController#move');
  this.gameComponent.deselectCountry();
  this.game.move(player, from, to);
};

GameController.prototype.constructor = GameController;

module.exports = GameController;
