'use strict';

var F         = require('fkit'),
    Immutable = require('immutable');

/**
 * This module defines core operations.
 *
 * @module
 */
module.exports = {
  /**
   * Logs a message to the console.
   */
  log: function(message) {
    if ((typeof DEBUG !== 'undefined' && DEBUG) ||
        (typeof DEVELOPMENT !== 'undefined' && DEVELOPMENT)) {
      console.log(message);
    }
  },

  /**
   * Clamps the number `n` between `a` and `b`.
   */
  clamp: function(n, a, b) {
    return Math.min(b, Math.max(a, n));
  },

  /**
   * Returns true if `n` is between `a` and `b`, false otherwise.
   */
  between: function(n, a, b) {
    return n >= a && n <= b;
  },

  /**
   * Rolls `n` dice and returns the sum of their values.
   */
  rollDice: function(n) {
    return F.array(n).map(function() { return F.randomInt(1, 6); });
  },

  /**
   * Adds the hashable objects in the list of `as` to the `map`.
   */
  mergeObjects: F.curry(function(as, map) {
    return map.withMutations(function(map) {
      as.forEach(function(a) {
        map.set(a.id, a);
      });
    });
  }),

  /**
   * Creates a map from the hashable objects in the list of `as`.
   */
  mapFromObjects: function(as) {
    return as
      .reduce(function(map, a) {
        return map.set(a.id, a);
      }, Immutable.Map().asMutable())
      .asImmutable();
  },

  /**
   * Distributes `n` units round-robin using the availability list of `as`.
   */
  distribute: function(n, as) {
    var bs = F.replicate(as.length, 0);

    return distributeInto(n, as, bs);

    // Recursively distributes `n` units into the list of `bs` using the
    // availability list of `as`.
    function distributeInto(n, as, bs) {
      if (n <= 0 || F.sum(bs) >= F.sum(as)) {
        return bs;
      } else {
        // Calculate the difference list.
        var cs = F.zip(bs, as).map(F.uncurry(F.sub));

        // Calculate the number of units to distribute in the next pass.
        var m = Math.min(n, cs.filter(F.id).length);

        return distributeInto(n - m, as, pass(m, bs, cs));
      }
    }

    // Performs a pass over the list of `bs`, distributing `m` units using the
    // difference list of `cs`.
    function pass(m, bs, cs) {
      var ds = bs.concat();

      for (var i = 0; i < cs.length && m > 0; i++) {
        if (cs[i] > 0) {
          m -= 1;
          ds[i] += 1;
        }
      }

      return ds;
    }
  },
};
