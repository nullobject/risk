import Game from '../src/game'
import sinon from 'sinon'
import {assert} from 'chai'

describe('Game', () => {
  let sandbox, game

  // Player stub.
  const player = {}

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
    game = new Game([player], world)
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('#moveToCountry', () => {
    beforeEach(() => {
      game.currentPlayer = player
      game.selectedCountry = source
    })

    it('should move to the target country if the selected country is unoccupied', () => {
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

    it('should attack the target country if the selected country is occupied', () => {
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
