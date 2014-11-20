import * as core from './core';
import * as F from 'fkit';

/**
 * Returns true if the country is not occupied by the given player, false
 * otherwise.
 *
 * @function
 */
var notOccupiedByPlayer = player => {
  return F.compose(F.notEqual(player), F.get('player'));
};

/**
 * Returns true if the player can attack/move neighbouring countries with the
 * given country, false otherwise.
 *
 * @curried
 * @function
 */
var canMove = F.curry((world, player, country) => {
  var neighbouringCountries = world.countriesNeighbouring(country);
  return F.any(notOccupiedByPlayer(player), neighbouringCountries);
});

/**
 * Returns true if the country has more than two armies, false otherwise.
 *
 * @function
 */
var withArmies = F.compose(F.gte(2), F.get('armies'));

/**
 * Selects a target country using a heuristic function.
 *
 * @function
 */
var selectTarget = F.minimumBy((a, b) => {
  return a.armies < b.armies;
});

export default class AI {
  /**
   * Calculates the next move for an AI player.
   */
  nextMove(world, player) {
    core.log('AI#nextMove');

    var countries       = world.countriesOccupiedBy(player),
        sourceCountries = countries.filter(withArmies).filter(canMove(world, player)),
        sourceCountry   = F.head(sourceCountries);

    if (sourceCountry) {
      var neighbouringCountries = world.countriesNeighbouring(sourceCountry),
          targetCountries       = neighbouringCountries.filter(notOccupiedByPlayer(player)),
          targetCountry         = selectTarget(targetCountries);

      if (targetCountry) {
        var moves = [
          {type: 'select-country', country: sourceCountry},
          {type: 'select-country', country: targetCountry}
        ];

        return [F.copy(this), moves];
      }
    }

    return [F.copy(this), [{type: 'end-turn'}]];
  }
}
