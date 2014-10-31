'use strict';

var F = require('fkit');

module.exports = {
  log: function(message) {
    if (typeof DEVELOPMENT !== 'undefined' && DEVELOPMENT) {
      console.log(message);
    }
  },

  /*
   * Rolls `n` dice and returns the sum of their values.
   */
  rollDice: function(n) {
    return F.array(n).map(function() { return F.randomInt(1, 6); });
  },

  /*
   * Replaces `as` with `bs` in the set `c`.
   */
  replace: F.curry(function(as, bs, c) {
    return c.withMutations(function(set) {
      set.subtract(as).union(bs);
    });
  }),

  /*
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
