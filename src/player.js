'use strict';

// Returns a new player.
module.exports = function(id) {
  return {
    id: id,

    toString: function() {
      return 'player-' + this.id;
    }
  };
};
