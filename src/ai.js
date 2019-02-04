import { Signal } from 'bulb'
import { any, compose, curry, head, get, gte, minimumBy, neq } from 'fkit'

import log from './log'

/**
 * Returns true if the country is not occupied by the given player, false
 * otherwise.
 */
const notOccupiedByPlayer = player =>
  compose(neq(player), get('player'))

/**
 * Returns true if the player can attack/move neighbouring countries with the
 * given country, false otherwise.
 */
const canMove = curry((player, world, country) => {
  const neighbouringCountries = world.countriesNeighbouring(country)
  return any(notOccupiedByPlayer(player), neighbouringCountries)
})

/**
 * Returns true if the country has more than two armies, false otherwise.
 */
const withArmies = compose(gte(2), get('armies'))

/**
 * Selects a target country using a heuristic function.
 */
const selectTarget = minimumBy((a, b) => a.armies < b.armies)

/**
 * Calculates the next move the given player and world state.
 *
 * @returns A new signal.
 */
const nextMove = curry((player, world) => {
  log.debug('AI.nextMove')

  const sourceCountries = world
    .countriesOccupiedBy(player)
    .filter(withArmies)
    .filter(canMove(player, world))

  const sourceCountry = head(sourceCountries)

  if (sourceCountry) {
    const neighbouringCountries = world.countriesNeighbouring(sourceCountry)
    const targetCountries = neighbouringCountries.filter(notOccupiedByPlayer(player))
    const targetCountry = selectTarget(targetCountries)

    if (targetCountry) {
      return Signal.fromArray([
        { type: 'select-country', country: sourceCountry },
        { type: 'select-country', country: targetCountry }
      ])
    }
  }

  return Signal.of('end-turn')
})

export default nextMove
