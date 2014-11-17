'use strict';

var core      = require('./core'),
    F         = require('fkit'),
    Immutable = require('immutable');

module.exports = {
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
        var island = core.traverse(remainingCountriesSet.first(), f);

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
