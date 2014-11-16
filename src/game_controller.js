'use strict';

var AI           = require('./ai'),
    Bacon        = require('baconjs'),
    F            = require('fkit'),
    Game         = require('./game'),
    Player       = require('./player'),
    React        = require('react'),
    WorldBuilder = require('./world_builder');

var RootComponent = React.createFactory(require('./components/root_component'));

/**
 * The number of milliseconds between clock ticks.
 */
var CLOCK_INTERVAL = 100;

/**
 * The number of players in the game.
 */
var PLAYERS = 5;

/**
 * The number of human players in the game.
 */
var HUMANS = 1;

function transformGameState(game, event) {
  switch (event.type) {
    case 'end-turn':
      return game.endTurn();
    case 'select-country':
      return game.selectCountry(event.country);
    default:
      return game;
  }
}

function GameController(options) {
  // Create the players.
  var players = F.range(0, PLAYERS).map(Player);

  // Create the world.
  var world = WorldBuilder.build(options.width, options.height);

  // Create the game state.
  var game = new Game(players, world);

  // Create the input bus.
  var inputBus = new Bacon.Bus();

  // Create the main app bus.
  var mainBus = new Bacon.Bus();

  // Create the clock tick stream.
  var clock = Bacon.interval(CLOCK_INTERVAL, CLOCK_INTERVAL);

  // The game property scans the game state transformer function over events on
  // the main bus.
  var gameProperty = mainBus.scan(game, transformGameState);

  // Map player IDs to AI streams.
  var aiStream = Bacon.mergeAll(F.drop(HUMANS, game.players).map(playerAI));

  // Plug the input bus into the main bus.
  mainBus.plug(inputBus);

  // Plug the AI stream into the main bus.
  mainBus.plug(aiStream);

  // Render the UI whenever the game property changes.
  gameProperty.onValue(function(game) {
    React.render(
      RootComponent({game: game, stream: inputBus}),
      options.el
    );
  });

  /*
   * The player AI stream emits the moves calculated for a player.
   */
  function playerAI(player) {
    var worldProperty = gameProperty.map('.world');

    return worldProperty
      .sampledBy(playerClock(player))
      .withStateMachine(new AI(), function(ai, event) {
        if (event.hasValue()) {
          var world  = event.value(),
              result = ai.nextMove(world, player),
              ai_    = result[0],
              events = result[1].map(function(move) { return new Bacon.Next(move); });

          return [ai_, events];
        } else {
          return [ai, [event]];
        }
      });
  }

  /*
   * Returns a clock stream which emits tick events only when the player is
   * current.
   */
  function playerClock(player) {
    var currentPlayerProperty = gameProperty.map('.currentPlayer');
    return clock.map(currentPlayerProperty).filter(F.equal(player));
  }
}

GameController.prototype.constructor = GameController;

module.exports = GameController;
