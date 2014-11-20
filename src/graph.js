/**
 * This module defines operations on graphs.
 *
 * @module
 */

import * as F from 'fkit';
import * as Immutable from 'immutable';

/**
 * Performs a depth-first traversal of a graph starting at node `n` using the
 * adjacency function `f`.
 *
 * @param f The adjacency function.
 * @param n The start node.
 * @returns A list of adjacent nodes.
 */
export function traverse(f, n) {
  var visited = Immutable.Set();

  return traverse_(n, visited).toArray();

  function traverse_(node, visited) {
    visited = visited.add(node);

    f(node).map(neighbour => {
      if (!visited.contains(neighbour)) {
        visited = traverse_(neighbour, visited);
      }
    });

    return visited;
  }
}

/**
 * Calculates islands of connected nodes using a depth-first travsersal.
 *
 * @curried
 * @function
 * @param f The adjacency function.
 * @param nodes The list of nodes.
 */
export var calculateIslands = F.curry((f, nodes) => {
  var nodesSet   = Immutable.Set(nodes),
      islandsSet = Immutable.Set();

  return calculateIslands_(nodesSet, islandsSet).toArray();

  function calculateIslands_(remainingNodesSet, islandsSet) {
    if (remainingNodesSet.size > 0) {
      var island = traverse(f, remainingNodesSet.first());

      // Add the island to the islands set.
      islandsSet = islandsSet.add(island);

      // Remove the island from the remaining nodes set.
      remainingNodesSet = remainingNodesSet.subtract(island);

      // Recurse with the remaining nodes set.
      islandsSet = calculateIslands_(remainingNodesSet, islandsSet);
    }

    return islandsSet;
  }
});

/**
 * Finds the largest island.
 *
 * @function
 * @param as The list of islands.
 * @returns The largest island.
 */
export var findLargestIsland = F.maximumBy((a, b) => { return a.length > b.length; });
