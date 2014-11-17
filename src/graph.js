'use strict';

var core      = require('./core'),
    F         = require('fkit'),
    Immutable = require('immutable');

var self;

/**
 * This module defines operations on graphs.
 *
 * @module
 */
self = module.exports = {
  /**
   * Performs a depth-first traversal of a graph starting at node `n` using the
   * adjacency function `f`.
   *
   * @param f The adjacency function.
   * @param n The start node.
   * @returns A list of adjacent nodes.
   */
  traverse: function(f, n) {
    var visited = Immutable.Set();

    return traverse_(n, visited);

    function traverse_(node, visited) {
      visited = visited.add(node);

      f(node).map(function(neighbour) {
        if (!visited.contains(neighbour)) {
          visited = traverse_(neighbour, visited);
        }
      });

      return visited;
    }
  },

  /**
   * Calculates islands of connected nodes using a depth-first travsersal.
   *
   * @curried
   * @function
   * @param f The adjacency function.
   * @param nodes The list of nodes.
   */
  calculateIslands: F.curry(function(f, nodes) {
    var nodesSet   = Immutable.Set(nodes),
        islandsSet = Immutable.Set();

    return calculateIslands_(nodesSet, islandsSet).toArray();

    function calculateIslands_(remainingNodesSet, islandsSet) {
      if (remainingNodesSet.size > 0) {
        var island = self.traverse(f, remainingNodesSet.first());

        // Add the island to the islands set.
        islandsSet = islandsSet.add(island);

        // Remove the island from the remaining nodes set.
        remainingNodesSet = remainingNodesSet.subtract(island);

        // Recurse with the remaining nodes set.
        islandsSet = calculateIslands_(remainingNodesSet, islandsSet);
      }

      return islandsSet;
    }
  }),

  /**
   * Finds the largest island.
   *
   * @function
   * @param as The list of islands.
   * @returns The largest island.
   */
  findLargestIsland: F.maximumBy(function(a, b) { return a.length > b.length; }),
};
