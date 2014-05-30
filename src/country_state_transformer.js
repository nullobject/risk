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
  handleEvent: function(game, player, previousCountry, event) {
    var result  = this.nextAction(game, player, previousCountry, event.value()),
        country = result[0],
        action  = result[1];

    return [country, dispatch(action)];
  },

  // The state transformation function which determines the player's action
  // from the countries they select.
  //
  // Returns a tuple containing the country and the player's action.
  //
  // FIXME: We need a reference to the game and player to properly determine
  // the next action. For example, the player must first choose one of their
  // own countries before selecting a neighbouring country.
  nextAction: function(game, player, previousCountry, nextCountry) {
    var action = null, country = null;

    if (previousCountry === null && game.canSelect(player, nextCountry)) {
      action = this.selectCountry.bind(this, nextCountry);
      country = nextCountry;
    } else if (previousCountry !== null && previousCountry === nextCountry) {
      action = this.deselectCountry.bind(this);
    } else if (previousCountry !== null && game.canMove(player, previousCountry, nextCountry)) {
      action = function() {
        this.deselectCountry();
        game.move(player, previousCountry, nextCountry);
      }.bind(this);
    } else {
      country = previousCountry;
    }

    return [country, action];
  }
};
