'use strict';

// The Player class represents a player in the game.
function Player(id) {
  this.id = id;
}

Player.prototype.constructor = Player;

Player.prototype.toString = function() {
  return 'player-' + this.id;
};

module.exports = Player;
