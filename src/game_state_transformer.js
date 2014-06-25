'use strict';

var Bacon = require('baconjs').Bacon;

module.exports = {
  // A state transformation function which determines the player's actions
  // given an input event.
  transformState: function(state, event) {
    // Apply the state transformation to the current state and event value.
    var result = this.actions(state, event.value());

    // Extract the result.
    var nextState = result[0],
        actions   = result[1];

    // Map actions to Bacon events.
    var events = actions.map(function(action) {
      return new Bacon.Next(action);
    });

    return [nextState, events];
  },

  // Calculates the next state and the player's actions given the current state
  // and an input tuple containing the current player and a selected country.
  //
  // Returns an array of tuples representing the player's actions.
  actions: function(state, input) {
    var previousPlayer  = state[0],
        player          = input[0],
        nextPlayer      = player,
        previousCountry = state[1],
        country         = input[1],
        nextCountry     = null,
        output          = [];

    if (previousPlayer !== player) {
      output.push(['currentPlayer', previousPlayer, player]);
      output.push(['selectedCountry', null]);
    } else if (!previousCountry && country && this.game.canSelect(player, country)) {
      output.push(['selectedCountry', country]);
      nextCountry = country;
    } else if (previousCountry && country && previousCountry === country) {
      output.push(['selectedCountry', null]);
    } else if (previousCountry && country && this.game.canMove(player, previousCountry, country)) {
      output.push(['move', player, previousCountry, country]);
      output.push(['selectedCountry', null]);
    } else {
      nextCountry = previousCountry;
    }

    var nextState = [nextPlayer, nextCountry];

    return [nextState, output];
  }
};
