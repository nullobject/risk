import * as F from 'fkit'
import * as core from './core'
import Immutable from 'immutable'

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
  const keys = F.concat(playerSubgraphs.map(subgraph => subgraph.keys()))

  return keys.reduce((list, key) => {
    const path = graph.shortestPathBy(country => country.player !== player, key)

    if (F.empty(path)) {
      throw new Error("Can't calculate depth map from empty path.")
    }

    const depth = path.length - 2

    return list.update(depth, set =>
      (set || Immutable.Set()).add(key)
    )
  }, Immutable.List()).toJS()
}

/**
 * Calculates the total number of reinforcements for the player subgraphs.
 *
 * @param playerSubgraphs A list of player subgraphs.
 */
function calculateTotalReinforcements (playerSubgraphs) {
  const maxSubgraphSize = F.maximumBy(core.bySize, playerSubgraphs).size
  const countries = F.concatMap(subgraph => subgraph.values(), playerSubgraphs)
  const totalAvailableSlots = F.sum(countries.map(F.get('availableSlots')))
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
    const as = countries.map(F.get('availableSlots'))

    // Calculate the distribution list.
    const bs = core.distribute(n, as)

    n -= F.sum(bs)

    result = keys.reduce((result, key, index) => {
      return F.set(key, bs[index], result)
    }, result)

    return [n, result]
  }, [n, {}])[1]
}
