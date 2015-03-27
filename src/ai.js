import * as core from './core';
import F from 'fkit';

/**
 * Returns true if the country is not occupied by the given player, false
 * otherwise.
 *
 * @function
 */
const notOccupiedByPlayer = player =>
  F.compose(F.notEqual(player), F.get('player'));

/**
 * Returns true if the player can attack/move neighbouring countries with the
 * given country, false otherwise.
 *
 * @curried
 * @function
 */
const canMove = F.curry((world, player, country) => {
  let neighbouringCountries = world.countriesNeighbouring(country);
  return F.any(notOccupiedByPlayer(player), neighbouringCountries);
});

/**
 * Returns true if the country has more than two armies, false otherwise.
 *
 * @function
 */
const withArmies = F.compose(F.gte(2), F.get('armies'));

/**
 * Selects a target country using a heuristic function.
 *
 * @function
 */
const selectTarget = F.minimumBy((a, b) => a.armies < b.armies);

export default class AI {
  /**
   * Calculates the next move for an AI player.
   */
  nextMove(world, player) {
    core.log('AI#nextMove');

    let countries       = world.countriesOccupiedBy(player),
        sourceCountries = countries.filter(withArmies).filter(canMove(world, player)),
        sourceCountry   = F.head(sourceCountries);

    if (sourceCountry) {
      let neighbouringCountries = world.countriesNeighbouring(sourceCountry),
          targetCountries       = neighbouringCountries.filter(notOccupiedByPlayer(player)),
          targetCountry         = selectTarget(targetCountries);

      if (targetCountry) {
        let moves = [
          {type: 'select-country', country: sourceCountry},
          {type: 'select-country', country: targetCountry}
        ];

        return [F.copy(this), moves];
      }
    }

    return [F.copy(this), [{type: 'end-turn'}]];
  }
}
