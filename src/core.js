/**
 * This module defines core operations.
 *
 * @module
 */

import F from 'fkit'

/**
 * Logs a message to the console.
 */
export function log (message) {
  console.log(message)
}

/**
 * Clamps the number `n` between `a` and `b`.
 */
export function clamp (n, a, b) {
  return Math.min(b, Math.max(a, n))
}

/**
 * Returns true if `n` is between `a` and `b`, false otherwise.
 */
export function between (n, a, b) {
  return n >= a && n <= b
}

/**
 * Rolls `n` dice and returns the sum of their values.
 */
export function rollDice (n) {
  return F.array(n).map(() => F.randomInt(1, 6))
}

/**
 * Reverse sorts a list using natural ordering.
 */
export const reverseSort = F.compose(F.reverse, F.sort)

/**
 * Size comparator.
 */
export const bySize = (a, b) => F.compare(a.size, b.size)

export const bySizeDescending = (a, b) => -F.compare(a.size, b.size)

/**
 * Distributes `n` units round-robin using the availability list of `as`.
 */
export function distribute (n, as) {
  let bs = F.replicate(as.length, 0)

  return distributeInto(n, as, bs)

  // Recursively distributes `n` units into the list of `bs` using the
  // availability list of `as`.
  function distributeInto (n, as, bs) {
    if (n <= 0 || F.sum(bs) >= F.sum(as)) {
      return bs
    } else {
      // Calculate the difference list.
      let cs = F.zip(bs, as).map(F.uncurry(F.sub))

      // Calculate the number of units to distribute in the next pass.
      let m = Math.min(n, cs.filter(F.id).length)

      return distributeInto(n - m, as, pass(m, bs, cs))
    }
  }

  // Performs a pass over the list of `bs`, distributing `m` units using the
  // difference list of `cs`.
  function pass (m, bs, cs) {
    let ds = bs.concat()

    for (let i = 0; i < cs.length && m > 0; i++) {
      if (cs[i] > 0) {
        m -= 1
        ds[i] += 1
      }
    }

    return ds
  }
}
