import Game from './Game'

describe('Game', () => {
  let game

  // Player stubs.
  const computer = { human: false }
  const human = { human: true }

  // Country stubs.
  const source = {}
  const target = {}

  // World stub.
  const world = {
    countries: [source, target],
    assignPlayers: () => world,
    countriesOccupiedBy: () => [source]
  }

  beforeEach(() => {
    game = new Game([human, computer], world)
  })

  describe('#alivePlayers', () => {
    it('returns the alive players', () => {
      expect(game.alivePlayers).toEqual([human, computer])
    })
  })

  describe('#aliveComputerPlayers', () => {
    it('returns the alive computer players', () => {
      expect(game.aliveComputerPlayers).toEqual([computer])
    })
  })

  describe('#aliveHumanPlayers', () => {
    it('returns the alive human players', () => {
      expect(game.aliveHumanPlayers).toEqual([human])
    })
  })

  describe('#moveToCountry', () => {
    beforeEach(() => {
      game.currentPlayer = human
      game.selectedCountry = source
    })

    it('moves to the target country if the selected country is unoccupied', () => {
      const newWorld = {}

      world.move = jest.fn(() => newWorld)

      const result = game.moveToCountry(target)

      expect(result.selectedCountry).toBeNull()
      expect(result.world).toEqual(newWorld)
    })

    it('attacks the target country if the selected country is occupied', () => {
      const newWorld = {}

      world.attack = jest.fn(() => newWorld)

      const result = game.moveToCountry(target)

      expect(result.selectedCountry).toBeNull()
      expect(result.world).toEqual(newWorld)
    })
  })
})
