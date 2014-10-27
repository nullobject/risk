'use strict';

var core     = require('./core'),
    F        = require('fkit'),
    Player   = require('./player');

// The number of players in the game.
var PLAYERS = 5;

/*
 * Returns a new game state.
 */
function Game(world) {
  var a = arguments;

  if (a.length > 0) {
    // Create the players.
    var players = F.range(0, PLAYERS).map(Player);

    // Assign each player to a random country.
    world = world.assignPlayers(players);

    this.players         = players;
    this.world           = world;
    this.currentPlayer   = null;
    this.selectedCountry = null;
  }
}

Game.prototype.constructor = Game;

/*
 * Returns the total number of armies for a given player.
 */
Game.prototype.armiesForPlayer = function(player) {
  return F.sum(
    this.world
      .countriesOccupiedByPlayer(player)
      .map(F.get('armies'))
  );
};

/*
 * Returns true if a given player can be set, false otherwise.
 */
Game.prototype.canSelectPlayer = function(player) {
  return player !== null && player !== this.currentPlayer;
};

/*
 * Returns true if a given country can be set, false otherwise.
 */
Game.prototype.canSelectCountry = function(country) {
  return this.canMoveToCountry(country) || this.canSetCountry(country);
};

/*
 * Returns true if the current player can select a given country, false
 * otherwise.
 */
Game.prototype.canSetCountry = function(country) {
  return country !== null && country.player === this.currentPlayer;
};

/*
 * Returns true if the current player can deselect a given country, false
 * otherwise.
 */
Game.prototype.canUnsetCountry = function(country) {
  return country !== null &&
    country.player === this.currentPlayer &&
    country === this.selectedCountry;
};

/*
 * Returns true if the current player can move to a given country, false
 * otherwise.
 */
Game.prototype.canMoveToCountry = function(country) {
  return country !== null &&
    this.currentPlayer !== null &&
    country.player !== this.currentPlayer &&
    this.selectedCountry !== null &&
    this.selectedCountry.player === this.currentPlayer &&
    this.selectedCountry.armies > 1 &&
    this.selectedCountry.hasNeighbour(country);
};

/*
 * Selects a given player and returns a new game state.
 */
Game.prototype.selectPlayer = function(player) {
  core.log('Game#selectPlayer');

  if (player === this.currentPlayer) {
    throw new Error('The player is already selected');
  }

  var world = this.currentPlayer ?
    this.world.reinforce(this.world.countriesOccupiedByPlayer(this.currentPlayer)) :
    this.world;

  return F.copy(this, {
    currentPlayer:   player,
    selectedCountry: null,
    world:           world
  });
};

/*
 * Selects a given country and returns a new game state.
 */
Game.prototype.selectCountry = function(country) {
  core.log('Game#selectCountry');

  if (this.canMoveToCountry(country)) {
    return this.moveToCountry(country);
  } else if (this.canUnsetCountry(country)) {
    return F.set('selectedCountry', null, this);
  } else if (this.canSetCountry(country)) {
    return F.set('selectedCountry', country, this);
  } else {
    return this;
  }
};

/*
 * Moves to the target country from the selected country and returns a new game
 * state. If the target country is occupied then the invading armies will
 * attack.
 */
Game.prototype.moveToCountry = function(country) {
  core.log('Game#moveToCountry');

  var world = country.player ?
    this.world.attack(this.selectedCountry, country) :
    this.world.move(this.selectedCountry, country);

  return F.copy(this, {
    selectedCountry: null,
    world:           world
  });
};

module.exports = Game;
