import Game from '../src/game'
import sinon from 'sinon'
import { assert } from 'chai'

describe('Game', () => {
  let sandbox, game

  // Player stubs.
  const computer = { human: false }
  const human = { human: true }

  // Country stubs.
  const source = {}
  const target = {}

  // World stub.
  const world = {
    countries: [source, target],
    assignPlayers: () => {},
    countriesOccupiedBy: () => {},
    move: () => {},
    attack: () => {}
  }

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(world, 'assignPlayers').returns(world)
    sandbox.stub(world, 'countriesOccupiedBy').returns([source])
    game = new Game([human, computer], world)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#alivePlayers', () => {
    it('returns the alive players', () => {
      assert.deepEqual(game.alivePlayers, [human, computer])
    })
  })

  describe('#aliveComputerPlayers', () => {
    it('returns the alive computer players', () => {
      assert.deepEqual(game.aliveComputerPlayers, [computer])
    })
  })

  describe('#aliveHumanPlayers', () => {
    it('returns the alive human players', () => {
      assert.deepEqual(game.aliveHumanPlayers, [human])
    })
  })

  describe('#moveToCountry', () => {
    beforeEach(() => {
      game.currentPlayer = human
      game.selectedCountry = source
    })

    it('moves to the target country if the selected country is unoccupied', () => {
      const newWorld = {}

      const mock = sandbox
        .mock(world)
        .expects('move')
        .withArgs(source, target)
        .once()
        .returns(newWorld)

      const result = game.moveToCountry(target)

      assert.isNull(result.selectedCountry)
      assert.equal(result.world, newWorld)

      mock.verify()
    })

    it('attacks the target country if the selected country is occupied', () => {
      target.player = {}

      const newWorld = {}

      const mock = sandbox
        .mock(world)
        .expects('attack')
        .withArgs(source, target)
        .once()
        .returns(newWorld)

      const result = game.moveToCountry(target)

      assert.isNull(result.selectedCountry)
      assert.equal(result.world, newWorld)

      mock.verify()
    })
  })
})
