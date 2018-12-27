import { copy, elemIndex, get, head, set, sum } from 'fkit'

import log from './log'

export default class Game {
  constructor (players, world) {
    // Assign each player to a random country.
    world = world.assignPlayers(players)

    this.world = world
    this.players = players
    this.currentPlayer = head(players)
    this.selectedCountry = null
  }

  /**
   * Returns the players that are alive.
   */
  get alivePlayers () {
    return this.players.filter(
      player => this.world.countriesOccupiedBy(player).length > 0,
      this
    )
  }

  /**
   * Returns the computer players that are alive.
   */
  get aliveComputerPlayers () {
    return this.alivePlayers.filter(player => !player.human)
  }

  /**
   * Returns the human players that are alive.
   */
  get aliveHumanPlayers () {
    return this.alivePlayers.filter(player => player.human)
  }

  /**
   * Returns true if the game is over, false otherwise.
   */
  get over () {
    return this.aliveHumanPlayers.length === 0 || this.aliveComputerPlayers.length === 0
  }

  /**
   * Returns true if a human won the game, false otherwise.
   */
  get win () {
    return this.over && this.currentPlayer.human
  }

  /**
   * Returns the total number of armies for a given player.
   */
  armiesForPlayer (player) {
    return sum(
      this.world
        .countriesOccupiedBy(player)
        .map(get('armies'))
    )
  }

  /**
   * Returns true if the current player can select a given country, false
   * otherwise.
   */
  canSelectCountry (country) {
    return country !== null && country.player === this.currentPlayer
  }

  /**
   * Returns true if the current player can deselect a given country, false
   * otherwise.
   */
  canDeselectCountry (country) {
    return country !== null &&
      country.player === this.currentPlayer &&
      country === this.selectedCountry
  }

  /**
   * Returns true if the current player can move to a given country, false
   * otherwise.
   */
  canMoveToCountry (country) {
    return country !== null &&
      this.currentPlayer !== null &&
      country.player !== this.currentPlayer &&
      this.selectedCountry !== null &&
      this.selectedCountry.player === this.currentPlayer &&
      this.selectedCountry.armies > 1 &&
      this.world.neighbouring(country, this.selectedCountry)
  }

  /**
   * Ends the turn for the current player.
   *
   * @returns A new game state.
   */
  endTurn () {
    log.debug('Game#endTurn')

    // Find the index of the current and next players.
    const i = elemIndex(this.currentPlayer, this.alivePlayers)
    const j = (i + 1) % this.alivePlayers.length

    return this.selectPlayer(this.alivePlayers[j])
  }

  /**
   * Selects a given player and returns a new game state.
   */
  selectPlayer (player) {
    log.debug('Game#selectPlayer')

    if (player === this.currentPlayer) {
      throw new Error('The player is already selected')
    }

    let world = this.currentPlayer
      ? this.world.reinforce(this.currentPlayer)
      : this.world

    return copy(this, {
      currentPlayer: player,
      selectedCountry: null,
      world
    })
  }

  /**
   * Selects a given country and returns a new game state.
   */
  selectCountry (country) {
    let game = this
    let action

    log.debug('Game#selectCountry')

    if (game.canMoveToCountry(country)) {
      game = game.moveToCountry(country)
      const won = game.world.occupier(country) === game.currentPlayer
      action = won ? 'move' : 'defend'
    } else if (game.canDeselectCountry(country)) {
      game = set('selectedCountry', null, game)
      action = 'select'
    } else if (game.canSelectCountry(country)) {
      game = set('selectedCountry', country, game)
      action = 'select'
    }

    return { game, action }
  }

  /**
   * Moves to the target country from the selected country and returns a new game
   * state. If the target country is occupied then the invading armies will
   * attack.
   */
  moveToCountry (country) {
    let world

    log.debug('Game#moveToCountry')

    if (country.player) {
      world = this.world.attack(this.selectedCountry, country)
    } else {
      world = this.world.move(this.selectedCountry, country)
    }

    return copy(this, {
      selectedCountry: null,
      world: world
    })
  }
}
