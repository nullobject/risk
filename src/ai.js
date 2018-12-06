import * as F from 'fkit'
import log from './log'
import { Signal } from 'bulb'

/**
 * Returns true if the country is not occupied by the given player, false
 * otherwise.
 */
const notOccupiedByPlayer = player =>
  F.compose(F.notEqual(player), F.get('player'))

/**
 * Returns true if the player can attack/move neighbouring countries with the
 * given country, false otherwise.
 */
const canMove = F.curry((player, world, country) => {
  const neighbouringCountries = world.countriesNeighbouring(country)
  return F.any(notOccupiedByPlayer(player), neighbouringCountries)
})

/**
 * Returns true if the country has more than two armies, false otherwise.
 */
const withArmies = F.compose(F.gte(2), F.get('armies'))

/**
 * Selects a target country using a heuristic function.
 */
const selectTarget = F.minimumBy((a, b) => a.armies < b.armies)

/**
 * Calculates the next move the given player and world state.
 *
 * @returns A new signal.
 */
const nextMove = F.curry((player, world) => {
  log.debug('AI.nextMove')

  const sourceCountries = world
    .countriesOccupiedBy(player)
    .filter(withArmies)
    .filter(canMove(player, world))

  const sourceCountry = F.head(sourceCountries)

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

  return Signal.of({ type: 'end-turn' })
})

export default nextMove
