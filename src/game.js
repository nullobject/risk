import * as core from './core'
import F from 'fkit'

export default class Game {
  constructor (players, world) {
    let a = arguments

    if (a.length > 0) {
      // Assign each player to a random country.
      world = world.assignPlayers(players)

      this.world = world
      this.players = players
      this.currentPlayer = F.head(players)
      this.selectedCountry = null
    }
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
   * Returns true if the game is over, false otherwise.
   */
  get over () {
    return this.alivePlayers.length === 1
  }

  /**
   * Returns the total number of armies for a given player.
   */
  armiesForPlayer (player) {
    return F.sum(
      this.world
        .countriesOccupiedBy(player)
        .map(F.get('armies'))
    )
  }

  /**
   * Returns true if the current player can select a given country, false
   * otherwise.
   */
  canSetCountry (country) {
    return country !== null && country.player === this.currentPlayer
  }

  /**
   * Returns true if the current player can deselect a given country, false
   * otherwise.
   */
  canUnsetCountry (country) {
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
    core.log('Game#endTurn')

    // Find the index of the current and next players.
    const i = F.elemIndex(this.currentPlayer, this.alivePlayers)
    const j = (i + 1) % this.alivePlayers.length

    return this.selectPlayer(this.alivePlayers[j])
  }

  /**
   * Selects a given player and returns a new game state.
   */
  selectPlayer (player) {
    core.log('Game#selectPlayer')

    if (player === this.currentPlayer) {
      throw new Error('The player is already selected')
    }

    let world = this.currentPlayer
      ? this.world.reinforce(this.currentPlayer)
      : this.world

    return F.copy(this, {
      currentPlayer: player,
      selectedCountry: null,
      world: world
    })
  }

  /**
   * Selects a given country and returns a new game state.
   */
  selectCountry (country) {
    core.log('Game#selectCountry')

    if (this.canMoveToCountry(country)) {
      return this.moveToCountry(country)
    } else if (this.canUnsetCountry(country)) {
      return F.set('selectedCountry', null, this)
    } else if (this.canSetCountry(country)) {
      return F.set('selectedCountry', country, this)
    } else {
      return this
    }
  }

  /**
   * Moves to the target country from the selected country and returns a new game
   * state. If the target country is occupied then the invading armies will
   * attack.
   */
  moveToCountry (country) {
    core.log('Game#moveToCountry')

    let world = country.player
      ? this.world.attack(this.selectedCountry, country)
      : this.world.move(this.selectedCountry, country)

    return F.copy(this, {
      selectedCountry: null,
      world: world
    })
  }
}
