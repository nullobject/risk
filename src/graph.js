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
  return traverse_(n, Immutable.OrderedSet()).toArray();

  function traverse_(node, visited) {
    // Add the node to the set of visited nodes.
    visited = visited.add(node);

    // Recurse with the neighbours that are not yet visited.
    f(node).map(neighbour => {
      if (!visited.contains(neighbour)) {
        visited = traverse_(neighbour, visited);
      }
    });

    return visited;
  }
}

/**
 * Calculates islands of connected nodes in the list of `ns` using the
 * adjacency function `f`.
 *
 * @curried
 * @function
 * @param f The adjacency function.
 * @param ns The list of nodes.
 */
export var calculateIslands = F.curry((f, ns) => {
  return calculateIslands_(
    Immutable.OrderedSet(ns),
    Immutable.OrderedSet()
  ).toArray();

  function calculateIslands_(nodes, islands) {
    if (nodes.size > 0) {
      // Traverse the graph starting at the first node.
      var island = traverse(f, nodes.first());

      // Add the island to the set of islands.
      islands = islands.add(island);

      // Remove the island from the set of nodes.
      nodes = nodes.subtract(island);

      // Recurse with the remaining set of nodes.
      islands = calculateIslands_(nodes, islands);
    }

    return islands;
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
