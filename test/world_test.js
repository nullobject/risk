import { compose, eq, find, get } from 'fkit'
import factory from './support/factory'
import rewire from 'rewire'
import sinon from 'sinon'
import { assert } from 'chai'

const World = rewire('../src/world')

const core = World.__get__('core')
const reinforcement = World.__get__('reinforcement')

// Stub each call to the `rollDice` function with the return values in the list
// of `xss`.
function stubRollDice (sandbox, ...xss) {
  const stub = sandbox.stub(core, 'rollDice')
  xss.forEach((xs, i) => stub.onCall(i).returns(xs))
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
  let sandbox, x, y, z

  // Player stubs.
  const p = {}
  const q = {}

  // Country stubs.
  const p1 = factory.buildCountry('a', p, 4, 4)
  const p2 = factory.buildCountry('b', p, 2, 3)
  const p3 = factory.buildCountry('c', p, 1, 2)
  const q1 = factory.buildCountry('d', q, 2, 2)
  const q2 = factory.buildCountry('e', null, 0, 2)

  const world = factory.buildWorld([p1, p2, p3, q1, q2])

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#move', () => {
    beforeEach(() => {
      [x, y] = move(world, p1, q2)
    })

    it('moves the player to the target country', () => {
      assert.equal(x.player, p)
      assert.equal(y.player, p)
    })

    it('updates the armies', () => {
      assert.equal(x.armies, 2)
      assert.equal(y.armies, 2)
    })
  })

  describe('#attack', () => {
    context('when the attacker rolls higher than the defender', () => {
      beforeEach(() => {
        stubRollDice(sandbox, [6, 4, 2, 1], [6, 5]);
        [x, y] = attack(world, p1, q1)
      })

      it('moves the attacker to the target country', () => {
        assert.equal(x.player, p)
        assert.equal(y.player, p)
      })

      it('updates the armies', () => {
        assert.equal(x.armies, 2)
        assert.equal(y.armies, 1)
      })
    })

    context('when the attacker rolls equal to the defender', () => {
      beforeEach(() => {
        stubRollDice(sandbox, [5, 1, 1, 1], [6, 4]);
        [x, y] = attack(world, p1, q1)
      })

      it('does not move the attacker', () => {
        assert.equal(x.player, p)
        assert.equal(y.player, q)
      })

      it('updates the armies', () => {
        assert.equal(x.armies, 1)
        assert.equal(y.armies, 1)
      })
    })

    context('when the attacker rolls lower than the defender', () => {
      beforeEach(() => {
        stubRollDice(sandbox, [5, 2, 1, 1], [6, 4]);
        [x, y] = attack(world, p1, q1)
      })

      it('does not move the attacker', () => {
        assert.equal(x.player, p)
        assert.equal(y.player, q)
      })

      it('updates the armies', () => {
        assert.equal(x.armies, 1)
        assert.equal(y.armies, 1)
      })
    })
  })

  describe('#reinforce', () => {
    beforeEach(() => {
      sandbox.stub(reinforcement, 'depthIndex').returns([['a', 'b', 'c']])
      sandbox.stub(reinforcement, 'reinforcementMap').returns({ a: 1, b: 1, c: 1 });
      [x, y, z] = reinforce(world, p)
    })

    it('reinforces the countries', () => {
      assert.equal(x.armies, 4)
      assert.equal(y.armies, 3)
      assert.equal(z.armies, 2)
    })
  })
})
