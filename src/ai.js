'use strict';

var core = require('./core'),
    F    = require('fkit');

/**
 * Creates a new AI.
 */
function AI() {
}

AI.prototype.constructor = AI;

/**
 * Calculates the next move for an AI player.
 *
 * The next move is selected from the list of all possible moves using a
 * heuristic function.
 */
AI.prototype.nextMove = function(world, player) {
  core.log('AI#nextMove');

  // Returns true if the country is not occupied by the given player, false
  // otherwise.
  var notOccupiedByPlayer = function(player) { return F.compose(F.notEqual(player), F.get('player')); };

  // Returns true if the country has more than two armies, false otherwise.
  var withArmies = F.compose(F.gte(2), F.get('armies'));

  // Returns true if the country can attack/move any neighbouring countries,
  // false otherwise.
  var canMove = function(country) {
    var neighbouringCountries = world.countriesNeighbouring(country);
    return F.any(notOccupiedByPlayer(player), neighbouringCountries);
  };

  var countries       = world.countriesOccupiedByPlayer(player),
      sourceCountries = countries.filter(withArmies).filter(canMove),
      sourceCountry   = F.head(sourceCountries);

  if (sourceCountry) {
    var neighbouringCountries = world.countriesNeighbouring(sourceCountry),
        targetCountries       = neighbouringCountries.filter(notOccupiedByPlayer(player)),
        targetCountry         = F.head(targetCountries);

    if (targetCountry) {
      var moves = [
        {type: 'select-country', country: sourceCountry},
        {type: 'select-country', country: targetCountry}
      ];

      return [F.copy(this), moves];
    }
  }

  return [F.copy(this), [{type: 'end-turn'}]];
};

module.exports = AI;
