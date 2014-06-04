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
  handleEvent: function(previousCountry, event) {
    var result  = this.nextAction(previousCountry, event.value()),
        country = result[0],
        action  = result[1];

    return [country, dispatch(action)];
  },

  // The state transformation function which determines the player's action
  // from a given tuple containing the current player and a selected country.
  //
  // Returns a tuple containing the player's selected country and next action.
  nextAction: function(previousCountry, value) {
    var player      = value[0],
        country     = value[1],
        nextAction  = null,
        nextCountry = null;

    if (previousCountry === null && this.game.canSelect(player, country)) {
      nextAction  = this.selectCountry.bind(this, country);
      nextCountry = country;
    } else if (previousCountry !== null && previousCountry === country) {
      nextAction = this.deselectCountry.bind(this);
    } else if (previousCountry !== null && this.game.canMove(player, previousCountry, country)) {
      nextAction = this.move.bind(this, player, previousCountry, country);
    } else {
      nextCountry = previousCountry;
    }

    return [nextCountry, nextAction];
  }
};
