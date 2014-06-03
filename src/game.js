'use strict';

var Player  = require('./player');
var _       = require('lodash');
var builder = require('./builder');

// The Game class represents the state of the game. A game is played in a world
// by a number of players.
function Game(width, height) {
  this.width  = width;
  this.height = height;

  // Create the players.
  this.players = _.range(4).map(function(id) { return new Player(id); });

  // Build the world.
  this.world = builder.buildWorld(this.width, this.height, this.players);
}

Game.prototype.constructor = Game;

// Returns true if a given player can select a country, false otherwise.
Game.prototype.canSelect = function(player, country) {
  return player === country.player && country.armies > 1;
};

// Returns true if a given player can move their armies from/to a country, false otherwise.
Game.prototype.canMove = function(player, from, to) {
  return from.hasNeighbour(to);
};

// Moves armies from/to a country for a given player.
Game.prototype.move = function(player, from, to) {
  console.log('Game#move');
  this.world.move(from, to);
};

module.exports = Game;
