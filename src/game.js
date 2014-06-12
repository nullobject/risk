'use strict';

var Player = require('./player'),
    _      = require('lodash'),
    core   = require('./core');

function validateAction(countries, player, from, to) {
  // Assert the from country is in the world.
  if (!_.contains(countries, from)) {
    throw new Error("The 'from' country is not in the world");
  }

  // Assert the to country is in the world.
  if (!_.contains(countries, to)) {
    throw new Error("The 'to' country is not in the world");
  }

  // Assert the from country has enough armies.
  if (from.armies <= 1) {
    throw new Error("The 'from' country does not have enough armies");
  }

  // Assert the from country belongs to the player.
  if (from.player !== player) {
    throw new Error("The 'from' country does not belong to the player");
  }

  // Assert the to country does not belong to the player.
  if (to.player === player) {
    throw new Error("The 'to' country belongs to the player");
  }
}

// The Game class represents the state of the game. A game is played in a world
// by a number of players.
function Game(width, height, builder) {
  this.width  = width;
  this.height = height;

  // Create the players.
  this.players = _.range(5).map(function(id) { return new Player(id); });

  // Build the world.
  this.world = builder(this.width, this.height, this.players);
}

Game.prototype.constructor = Game;

// Returns the total number of armies for a given player.
Game.prototype.armies = function(player) {
  return this.world.countries.reduce(function(total, country) {
    if (country.player === player) {
      total += country.armies;
    }

    return total;
  }, 0);
};

// Returns true if a given player can select a country, false otherwise.
Game.prototype.canSelect = function(player, country) {
  return player === country.player && country.armies > 1;
};

// Returns true if a given player can move their armies from/to a country, false otherwise.
Game.prototype.canMove = function(player, from, to) {
  return from.hasNeighbour(to);
};

// Moves armies from/to a country for a given player. Returns true if the
// action was successful, false otherwise.
Game.prototype.move = function(player, from, to) {
  core.log('Game#move');

  validateAction(this.world.countries, player, from, to);

  to.player = from.player;
  to.armies = from.armies - 1;
  from.armies = 1;

  return true;
};

module.exports = Game;
