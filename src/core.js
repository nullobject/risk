/**
 * This module defines core operations.
 *
 * @module
 */

import { array, compare, compose, id, randomInt, replicate, reverse, sort, sub, sum, uncurry, zip } from 'fkit'

/**
 * Rolls `n` dice and returns the sum of their values.
 */
export function rollDice (n) {
  return array(n).map(() => randomInt(1, 6))
}

/**
 * Convert the given list of identifiable objects to a hash of vertices.
 */
export function toVertices (as) {
  return as.reduce((vs, a) => {
    vs[a.id] = a
    return vs
  }, {})
}

/**
 * Reverse sorts a list using natural ordering.
 */
export const reverseSort = compose(reverse, sort)

/**
 * Size comparator.
 */
export const bySize = (a, b) => compare(a.size, b.size)

/**
 * Reverse size comparator.
 */
export const bySizeDescending = (a, b) => -compare(a.size, b.size)

/**
 * Distributes `n` units round-robin using the availability list of `as`.
 */
export function distribute (n, as) {
  const bs = replicate(as.length, 0)

  return distributeInto(n, as, bs)

  // Recursively distributes `n` units into the list of `bs` using the
  // availability list of `as`.
  function distributeInto (n, as, bs) {
    if (n <= 0 || sum(bs) >= sum(as)) {
      return bs
    } else {
      // Calculate the difference list.
      const cs = zip(bs, as).map(uncurry(sub))

      // Calculate the number of units to distribute in the next pass.
      const m = Math.min(n, cs.filter(id).length)

      return distributeInto(n - m, as, pass(m, bs, cs))
    }
  }

  // Performs a pass over the list of `bs`, distributing `m` units using the
  // difference list of `cs`.
  function pass (m, bs, cs) {
    const ds = bs.concat()

    for (let i = 0; i < cs.length && m > 0; i++) {
      if (cs[i] > 0) {
        m -= 1
        ds[i] += 1
      }
    }

    return ds
  }
}
