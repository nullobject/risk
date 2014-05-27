'use strict';

var Bacon = require('baconjs').Bacon;
var _     = require('lodash');

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
  // from the countries they select.
  //
  // Returns a tuple containing the country and the player's action.
  //
  // FIXME: We need a reference to the current player to properly determine the
  // next action. For example, the player must first choose one of their own
  // countries before selecting a neighbouring country.
  nextAction: function(previousCountry, nextCountry) {
    var action = null, country = null;

    if (previousCountry && _.contains(previousCountry.neighbours, nextCountry)) {
      // The player selected one of the nearby countries.
      if (nextCountry.player !== null) {
        action = this.attack.bind(this, previousCountry, nextCountry);
      } else {
        action = this.move.bind(this, previousCountry, nextCountry);
      }
    } else if (previousCountry === nextCountry) {
      // The player selected the previously selected country.
      action = this.deselectCountry.bind(this, nextCountry);
    } else if (nextCountry.player !== null) {
      // The player selected a new country.
      action = this.selectCountry.bind(this, nextCountry);
      country = nextCountry;
    }

    return [country, action];
  }
};
