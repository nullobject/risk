import { concat, concatMap, empty, get, maximumBy, set, sum } from 'fkit'

import * as core from './core'

/**
 * Calculates the depth index for the player subgraphs.
 *
 * The depth index is a list of lists, where each list contains the countries
 * that are the same distance from any country belonging to another player.
 *
 * @param graph A graph.
 * @param playerSubgraphs A list of player subgraphs.
 */
export function depthIndex (graph, playerSubgraphs) {
  const player = playerSubgraphs[0].first().player

  // FIXME: FKit `concatMap` should handle arrays of strings properly.
  const keys = concat(playerSubgraphs.map(subgraph => subgraph.keys()))

  return keys.reduce((list, key) => {
    const path = graph.shortestPathBy(country => country.player !== player, key)

    if (empty(path)) {
      throw new Error("Can't calculate depth map from empty path.")
    }

    const depth = path.length - 2
    list[depth] = (list[depth] || new Set()).add(key)

    return list
  }, []).map(set => Array.from(set))
}

/**
 * Calculates the total number of reinforcements for the player subgraphs.
 *
 * @param playerSubgraphs A list of player subgraphs.
 */
function calculateTotalReinforcements (playerSubgraphs) {
  const maxSubgraphSize = maximumBy(core.bySize, playerSubgraphs).size
  const countries = concatMap(subgraph => subgraph.values(), playerSubgraphs)
  const totalAvailableSlots = sum(countries.map(get('availableSlots')))
  return Math.min(maxSubgraphSize, totalAvailableSlots)
}

/**
 * Calculates the number of reinforcements to place in each country occupied by a player.
 *
 * @param graph A graph.
 * @param playerSubgraphs A list of player subgraphs.
 * @param depthIndex A depth index.
 */
export function reinforcementMap (graph, playerSubgraphs, depthIndex) {
  let n = calculateTotalReinforcements(playerSubgraphs)

  return depthIndex.reduce(([n, result], keys, depth) => {
    const countries = keys.map(key => graph.get(key))

    // Calculate the availability list.
    const as = countries.map(get('availableSlots'))

    // Calculate the distribution list.
    const bs = core.distribute(n, as)

    n -= sum(bs)

    result = keys.reduce((result, key, index) => {
      return set(key, bs[index], result)
    }, result)

    return [n, result]
  }, [n, {}])[1]
}
