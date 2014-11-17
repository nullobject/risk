'use strict';

var core      = require('./core'),
    F         = require('fkit'),
    Immutable = require('immutable');

var self;

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
   * Calculates islands of connected countries using a depth-first travsersal.
   *
   * @curried
   * @function
   * @param f The adjacency function.
   * @param countries The list of countries.
   */
  calculateIslands: F.curry(function(f, countries) {
    var countriesSet = Immutable.Set(countries),
        islandsSet   = Immutable.Set();

    return calculateIslands_(countriesSet, islandsSet).toArray();

    function calculateIslands_(remainingCountriesSet, islandsSet) {
      if (remainingCountriesSet.size > 0) {
        var island = self.traverse(f, remainingCountriesSet.first());

        // Add the island to the islands set.
        islandsSet = islandsSet.add(island);

        // Remove the island from the remaining countries set.
        remainingCountriesSet = remainingCountriesSet.subtract(island);

        // Recurse with the remaining countries set.
        islandsSet = calculateIslands_(remainingCountriesSet, islandsSet);
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
