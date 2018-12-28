import { compose, eq, find, get } from 'fkit'

import * as core from './core'
import * as reinforcement from './reinforcement'
import { buildCountry, buildWorld } from '../test/support/factory'

jest.mock('./reinforcement')

/**
 * Mock each call to the `rollDice` function so that successive calls return
 * the given `values`.
 */
function mockRollDice (...values) {
  core.rollDice = jest.fn()
  values.forEach((value, i) => core.rollDice.mockReturnValueOnce(value))
}

function findCountries (as, bs) {
  return bs.map((q) => {
    return find(comparator(q), as)
  })

  function comparator (p) {
    return compose(eq(p.id), get('id'))
  }
}

function move (world, a, b) {
  const result = world.move(a, b)
  return findCountries(result.countries, [a, b])
}

function attack (world, a, b) {
  const result = world.attack(a, b)
  return findCountries(result.countries, [a, b])
}

function reinforce (world, player) {
  const result = world.reinforce(player)
  return findCountries(result.countries, world.countriesOccupiedBy(player))
}

describe('World', () => {
  // Player stubs.
  const p = {}
  const q = {}

  // Country stubs.
  const p1 = buildCountry('a', p, 4, 4)
  const p2 = buildCountry('b', p, 2, 3)
  const p3 = buildCountry('c', p, 1, 2)
  const q1 = buildCountry('d', q, 2, 2)
  const q2 = buildCountry('e', null, 0, 2)

  const world = buildWorld([p1, p2, p3, q1, q2])

  describe('#move', () => {
    it('moves the player to the target country', () => {
      const [x, y] = move(world, p1, q2)
      expect(x.player).toBe(p)
      expect(y.player).toBe(p)
    })

    it('updates the armies', () => {
      const [x, y] = move(world, p1, q2)
      expect(x.armies).toBe(2)
      expect(y.armies).toBe(2)
    })
  })

  describe('#attack', () => {
    describe('when the attacker rolls higher than the defender', () => {
      beforeEach(() => {
        mockRollDice([6, 4, 2, 1], [6, 5])
      })

      it('moves the attacker to the target country', () => {
        const [x, y] = attack(world, p1, q1)
        expect(x.player).toBe(p)
        expect(y.player).toBe(p)
      })

      it('updates the armies', () => {
        const [x, y] = attack(world, p1, q1)
        expect(x.armies).toBe(2)
        expect(y.armies).toBe(1)
      })
    })

    describe('when the attacker rolls equal to the defender', () => {
      beforeEach(() => {
        mockRollDice([5, 1, 1, 1], [6, 4])
      })

      it('does not move the attacker', () => {
        const [x, y] = attack(world, p1, q1)
        expect(x.player).toBe(p)
        expect(y.player).toBe(q)
      })

      it('updates the armies', () => {
        const [x, y] = attack(world, p1, q1)
        expect(x.armies).toBe(1)
        expect(y.armies).toBe(1)
      })
    })

    describe('when the attacker rolls lower than the defender', () => {
      beforeEach(() => {
        mockRollDice([5, 2, 1, 1], [6, 4])
      })

      it('does not move the attacker', () => {
        const [x, y] = attack(world, p1, q1)
        expect(x.player).toBe(p)
        expect(y.player).toBe(q)
      })

      it('updates the armies', () => {
        const [x, y] = attack(world, p1, q1)
        expect(x.armies).toBe(1)
        expect(y.armies).toBe(1)
      })
    })
  })

  describe('#reinforce', () => {
    beforeEach(() => {
      reinforcement.depthIndex.mockReturnValue([['a', 'b', 'c']])
      reinforcement.reinforcementMap.mockReturnValue({ a: 1, b: 1, c: 1 })
    })

    it('reinforces the countries', () => {
      const [x, y, z] = reinforce(world, p)
      expect(x.armies).toBe(4)
      expect(y.armies).toBe(3)
      expect(z.armies).toBe(2)
    })
  })
})
