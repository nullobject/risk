import * as core from './core'
import F from 'fkit'
import Immutable from 'immutable'

/**
 * Calculates the depth index for the player subgraphs.
 *
 * The depth index is a list of lists, where each list contains the countries
 * that are the same distance from any country belonging to another player.
 */
export function depthIndex (graph, subgraphs) {
  const player = subgraphs[0].first().player

  // FIXME: FKit `concatMap` should handle arrays of strings properly.
  const keys = F.concat(subgraphs.map(subgraph => subgraph.keys()))

  return keys.reduce((list, key) => {
    const path = graph.shortestPathBy(country => country.player !== player, key)

    if (F.empty(path)) {
      throw new Error("Can't calculate depth map from empty path.")
    }

    const depth = path.length - 2

    return list.update(depth, set => {
      return (set || Immutable.Set()).add(key)
    })
  }, Immutable.List()).toJS()
}

/**
 * Calculates the total number of reinforcements for the player subgraphs.
 */
function calculateTotalReinforcements (subgraphs) {
  const maxSubgraphSize = F.maximumBy(core.bySize, subgraphs).size
  const countries = F.concatMap(subgraph => subgraph.values(), subgraphs)
  const totalAvailableSlots = F.sum(countries.map(F.get('availableSlots')))
  return Math.min(maxSubgraphSize, totalAvailableSlots)
}

/**
 * TODO: First distribute to all countries with depth 0, then depth 1, and so
 * on.
 */
export function reinforcementMap (graph, subgraphs, depthIndex) {
  let n = calculateTotalReinforcements(subgraphs)

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
