'use strict';

var Bacon                = require('baconjs').Bacon,
    Game                 = require('./game'),
    GameComponent        = require('./components/game_component.jsx'),
    GameStateTransformer = require('./game_state_transformer'),
    React                = require('react'),
    _                    = require('lodash'),
    builder              = require('./world_builder').build,
    core                 = require('./core');

// Dispatches an action represented by a tuple to the given target. For
// example:
//
// ['move', player, country-a, country-b]
function dispatch(action, target) {
  var fn = target[_.head(action)];
  fn.apply(target, _.tail(action));
}

function GameController(options) {
  // Create the game model.
  this.game = new Game(options.width, options.height, builder);

  var players = this.game.players;

  // Create and extend the bus.
  var bus = _.tap(new Bacon.Bus(), function(bus) {
    bus.ofType = function(type) {
      return this.filter(function(event) {
        return event.type == type;
      });
    };
  });

  // Create the game component.
  this.gameComponent = React.renderComponent(
    GameComponent({game: this.game, stream: bus}),
    options.el
  );

  // The player property handles 'end-turn' events to cycle through the
  // players.
  var playerProperty = bus
    .ofType('end-turn')
    .scan(0, function(index, event) { return (index + 1) % players.length; })
    .map(function(index) { return players[index]; });

  // The country property handles 'select-country' events to provide the
  // selected country.
  var countryProperty = bus
    .ofType('select-country')
    .map('.country')
    .startWith(null);

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

// Sets the current player.
GameController.prototype.currentPlayer = function(previousPlayer, player) {
  core.log('GameController#currentPlayer', previousPlayer, player);

  if (previousPlayer) {
    this.game.reinforce(previousPlayer);
  }

  this.gameComponent.setState({currentPlayer: player});
};

// Sets the selected country.
GameController.prototype.selectedCountry = function(country) {
  core.log('GameController#selectedCountry', country);

  this.gameComponent.setState({selectedCountry: country});

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
