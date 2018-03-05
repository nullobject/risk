import * as F from 'fkit'
import * as core from './core'
import * as reinforcement from './reinforcement'
import log from './log'

/**
 * Returns true if the country is occupied by the given player, false
 * otherwise.
 */
function isOccupiedBy (player) {
  return F.compose(F.equal(player), F.get('player'))
}

export default class World {
  constructor (width, height, hexgrid, cells, graph) {
    this.width = width
    this.height = height
    this.hexgrid = hexgrid
    this.cells = cells
    this.graph = graph
  }

  get countries () { return this.graph.values() }

  /**
   * Returns the countries occupied by a player.
   */
  countriesOccupiedBy (player) {
    return this.countries.filter(isOccupiedBy(player))
  }

  /**
   * Returns the countries neighbouring country `a`.
   */
  countriesNeighbouring (a) {
    return this.graph.adjacentValues(a.id)
  }

  /**
   * Returns true if the countries `a` and `b` are neighbours.
   */
  neighbouring (a, b) {
    return this.graph.adjacent(a.id, b.id)
  }

  /**
   * Returns the player who occupies the given `country`.
   */
  occupier (country) {
    return this.graph.get(country.id).player
  }

  /**
   * Assigns the given players to random countries and returns a new world
   * state.
   */
  assignPlayers (players) {
    const as = F.sample(players.length, this.countries)

    const bs = as.map((country, index) =>
      F.copy(country, {player: players[index], armies: 2})
    )

    return F.set('graph', this.graph.merge(core.toVertices(bs)), this)
  }

  /**
   * Moves to the country `t` from the country `s` and returns a new world
   * state.
   */
  move (s, t) {
    log.debug('World#move')

    // Calculate the number of armies to move.
    const n = F.min(s.armies - 1, t.slots.length)

    const u = F.set('armies', s.armies - n, s)
    const v = F.copy(t, {armies: n, player: s.player})

    return F.set('graph', this.graph.merge(core.toVertices([u, v])), this)
  }

  /**
   * Attacks the country `t` from the country `s` and returns a new world
   * state.
   *
   * Rules of engagement:
   *
   * - If the attacker's total is higher than the defender's, then the attacker
   *   should move to the defender's country. If the totals were close, then
   *   the attacker should lose some of their armies (attrition).
   *
   * - If the defender's total is higher than the attacker's, then the attacker
   *   should lose all of their armies. If the totals were close, then the
   *   defender should lose some of their armies (attrition).
   *
   * - If the totals are equal, then the attacker and defender should lose all
   *   of their armies.
   */
  attack (s, t) {
    log.debug('World#attack')

    // Roll the dice!
    const attackerDice = core.rollDice(s.armies)
    const defenderDice = core.rollDice(t.armies)
    const attackerTotal = F.sum(attackerDice)
    const defenderTotal = F.sum(defenderDice)
    const delta = attackerTotal - defenderTotal

    // Calculate the casualties.
    const attackerCasualties = delta > 0 ? Math.round(s.armies / (Math.abs(delta) + 1)) : s.armies
    const defenderCasualties = delta < 0 ? Math.round(t.armies / (Math.abs(delta) + 1)) : t.armies

    log.debug(`attacker: ${attackerDice} (${attackerTotal}), casualties: ${attackerCasualties}`)
    log.debug(`defender: ${defenderDice} (${defenderTotal}), casualties: ${defenderCasualties}`)

    // Calculate the number of armies to move.
    const movers = F.min(s.armies - 1, t.slots.length)

    // Calculate the outcome for a win.
    const win = () => {
      const u = F.set('armies', s.armies - movers, s)
      const v = F.copy(t, {armies: F.max(movers - attackerCasualties, 1), player: s.player})
      return [u, v]
    }

    // Calculate the outcome for a loss.
    const lose = () => {
      const u = F.set('armies', F.max(s.armies - attackerCasualties, 1), s)
      const v = F.set('armies', F.max(t.armies - defenderCasualties, 1), t)
      return [u, v]
    }

    // Calculate the result.
    const as = delta > 0 ? win() : lose()

    return F.set('graph', this.graph.merge(core.toVertices(as)), this)
  }

  /**
   * Reinforces the given `player` and returns a new world state.
   */
  reinforce (player) {
    log.debug('World#reinforce')

    const playerSubgraphs = this.graph
      .filter(country => country.player === player)
      .connectedComponents()

    const depthIndex = reinforcement.depthIndex(this.graph, playerSubgraphs)
    const reinforcementMap = reinforcement.reinforcementMap(this.graph, playerSubgraphs, depthIndex)

    const graph = F.pairs(reinforcementMap).reduce((graph, [key, n]) => {
      return graph.update(key, country => country.reinforce(n))
    }, this.graph)

    return F.set('graph', graph, this)
  }
}
