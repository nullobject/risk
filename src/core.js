/**
 * This module defines core operations.
 *
 * @module
 */

import * as F from 'fkit'
import { Signal } from 'bulb'

/**
 * Rolls `n` dice and returns the sum of their values.
 */
export function rollDice (n) {
  return F.array(n).map(() => F.randomInt(1, 6))
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
export const reverseSort = F.compose(F.reverse, F.sort)

/**
 * Size comparator.
 */
export const bySize = (a, b) => F.compare(a.size, b.size)

/**
 * Reverse size comparator.
 */
export const bySizeDescending = (a, b) => -F.compare(a.size, b.size)

/**
 * Distributes `n` units round-robin using the availability list of `as`.
 */
export function distribute (n, as) {
  const bs = F.replicate(as.length, 0)

  return distributeInto(n, as, bs)

  // Recursively distributes `n` units into the list of `bs` using the
  // availability list of `as`.
  function distributeInto (n, as, bs) {
    if (n <= 0 || F.sum(bs) >= F.sum(as)) {
      return bs
    } else {
      // Calculate the difference list.
      const cs = F.zip(bs, as).map(F.uncurry(F.sub))

      // Calculate the number of units to distribute in the next pass.
      const m = Math.min(n, cs.filter(F.id).length)

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

/**
 * Creates a new signal from a bus.
 *
 * @param bus A bus.
 * @returns A new signal.
 */
export function fromBus (bus) {
  return new Signal(emit => {
    // Emit a value with the event type and data combined.
    const handler = (type, data) => emit.next({ ...data, type })

    bus.addListener('*', handler)
    return () => bus.removeListener('*', handler)
  })
}
