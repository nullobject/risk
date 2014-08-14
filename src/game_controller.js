'use strict';

var Bacon         = require('baconjs').Bacon,
    Game          = require('./game'),
    React         = require('react'),
    RootComponent = require('./components/root_component.jsx'),
    WorldBuilder  = require('./world_builder');

function transformState(game, input) {
  var player  = input[0],
      country = input[1];

  if (game.canSelectPlayer(player)) {
    game = game.selectPlayer(player);
  } else if (game.canSelectCountry(country)) {
    game = game.selectCountry(country);
  }

  return game;
}

function GameController(options) {
  this.options = options;

  // Create a world.
  var world = WorldBuilder(options.width, options.height);

  // Create a game state.
  var game = new Game(world);

  // Create and extend a bus.
  this.bus = new Bacon.Bus();
  this.bus.ofType = function(type) {
    return this.filter(function(event) {
      return event.type === type;
    });
  };

  // The player property handles 'end-turn' events to cycle through the
  // players.
  var playerProperty = this.bus
    .ofType('end-turn')
    .scan(0, function(index, event) { return (index + 1) % game.players.length; })
    .map(function(index) { return game.players[index]; });

  // The country property handles 'select-country' events to provide the
  // selected country.
  var countryProperty = this.bus
    .ofType('select-country')
    .map('.country')
    .startWith(null);

  // The player country property combines the player and country properties
  // into a tuple.
  var playerCountryProperty = Bacon.combineAsArray(playerProperty, countryProperty);

  // Apply the game state transformer to the country player property and render
  // the resulting game state.
  playerCountryProperty
    .scan(game, transformState)
    .onValue(this.render.bind(this));
}

// Renders a given game state.
GameController.prototype.render = function(game) {
  React.renderComponent(
    RootComponent({game: game, stream: this.bus}),
    this.options.el
  );
};

GameController.prototype.constructor = GameController;

module.exports = GameController;
