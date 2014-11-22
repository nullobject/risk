/**
 * This module defines core operations.
 *
 * @module
 */

import * as F from 'fkit';
import * as Immutable from 'immutable';

/**
 * Logs a message to the console.
 */
export function log(message) {
  if ((typeof DEBUG !== 'undefined' && DEBUG) ||
      (typeof DEVELOPMENT !== 'undefined' && DEVELOPMENT)) {
    console.log(message);
  }
}

/**
 * Clamps the number `n` between `a` and `b`.
 */
export function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

/**
 * Returns true if `n` is between `a` and `b`, false otherwise.
 */
export function between(n, a, b) {
  return n >= a && n <= b;
}

/**
 * Rolls `n` dice and returns the sum of their values.
 */
export function rollDice(n) {
  return F.array(n).map(() => { return F.randomInt(1, 6); });
}

/**
 * Adds the hashable objects in the list of `as` to the `map`.
 *
 * @function
 */
export var mergeObjects = F.curry((as, map) => {
  return map.withMutations(map => {
    as.forEach(a => {
      map.set(a.id, a);
    });
  });
});

/**
 * Creates a map from the hashable objects in the list of `as`.
 */
export function mapFromObjects(as) {
  return as
    .reduce((map, a) => {
      return map.set(a.id, a);
    }, Immutable.Map().asMutable())
    .asImmutable();
}

/**
 * Reverse sorts a list using natural ordering.
 *
 * @function
 */
export var reverseSort = F.compose(F.reverse, F.sort);

/**
 * Distributes `n` units round-robin using the availability list of `as`.
 */
export function distribute(n, as) {
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
}
