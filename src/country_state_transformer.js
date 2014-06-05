'use strict';

var Bacon = require('baconjs').Bacon;

function dispatch(fn) {
  if (fn) {
    return [new Bacon.Next(function() { return fn; })];
  } else {
    return [];
  }
}

module.exports = {
  handleEvent: function(state, event) {
    var result    = this.nextAction(state, event.value()),
        nextState = result[0],
        action    = result[1];

    return [nextState, dispatch(action)];
  },

  // The state transformation function which determines the player's action
  // from a given input tuple containing the current player and a selected
  // country.
  //
  // Returns a tuple containing the next state and the player's action (if
  // any).
  nextAction: function(state, input) {
    var previousPlayer  = state[0],
        player          = input[0],
        nextPlayer      = player,
        previousCountry = state[1],
        country         = input[1],
        nextCountry     = null,
        output          = null;

    if (previousPlayer && previousPlayer !== player) {
      output = this.deselectCountry.bind(this);
    } else if (!previousCountry && this.game.canSelect(player, country)) {
      output = this.selectCountry.bind(this, country);
      nextCountry = country;
    } else if (previousCountry && previousCountry === country) {
      output = this.deselectCountry.bind(this);
    } else if (previousCountry && this.game.canMove(player, previousCountry, country)) {
      output = this.move.bind(this, player, previousCountry, country);
    } else {
      nextCountry = previousCountry;
    }

    return [[nextPlayer, nextCountry], output];
  }
};
