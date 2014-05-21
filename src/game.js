'use strict';

var builder = require('./builder');

function Game(width, height) {
  this.width  = width;
  this.height = height;

  // Build a new world.
  this.world = builder.buildWorld(width, height);
}

Game.prototype.constructor = Game;

module.exports = Game;
