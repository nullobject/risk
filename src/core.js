'use strict';

var F = require('fkit');

module.exports = {
  log: function(message) {
    if (typeof DEVELOPMENT !== 'undefined' && DEVELOPMENT) {
      console.log(message);
    }
  },

  // Rolls `n` dice and returns the sum of their values.
  rollDice: function(n) {
    return F.array(n).map(function() { return F.randomInt(1, 6); });
  },

  // Replaces `as` with `bs` in the set `c`.
  replace: F.curry(function(as, bs, c) {
    return c.withMutations(function(set) {
      set.subtract(as).union(bs);
    });
  }),
};
