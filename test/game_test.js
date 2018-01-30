import Game from '../src/game'
import sinon from 'sinon'
import {assert} from 'chai'

describe('Game', () => {
  let sandbox, game

  // Player stubs.
  const ai = {human: false}
  const human = {human: true}

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
    sandbox.stub(world, 'countriesOccupiedBy').returns(1)
    game = new Game([human, ai], world)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#humanPlayers', () => {
    it('returns the human players', () => {
      assert.deepEqual(game.humanPlayers, [human])
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
