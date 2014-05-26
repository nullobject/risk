'use strict';

var _       = require('lodash');
var builder = require('./builder');

function Player(id) {
  this.id = id;
}

Player.prototype.constructor = Player;

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

// Attacks with the given player's armies from the source country to the target
// country.
Game.prototype.attack = function(player, source, target) {
  console.log('Game#attack');
};

// Moves the given player's armies from the source country to the target
// country.
Game.prototype.move = function(player, source, target) {
  console.log('Game#move');
  this.world.move(source, target);
};

module.exports = Game;
