import * as core from './core';
import * as graph from './graph';
import * as reinforcement from './reinforcement';
import F from 'fkit';
import Immutable from 'immutable';

/**
 * Returns true if the country is occupied by the given player, false
 * otherwise.
 */
function occupiedBy(player) {
  return F.compose(F.equal(player), F.get('player'));
}

export default class World {
  constructor(width, height, hexgrid, cells, graph) {
    let a = arguments;

    if (a.length > 0) {
      this.width   = width;
      this.height  = height;
      this.hexgrid = hexgrid;
      this.cells   = cells;
      this.graph   = graph;
    }
  }

  get countries() { return this.graph.values(); }

  /**
   * Returns the countries occupied by a player.
   */
  countriesOccupiedBy(player) {
    return this.countries.filter(occupiedBy(player));
  }

  /**
   * Returns the countries neighbouring country `a`.
   */
  countriesNeighbouring(a) {
    return this.graph.adjacentValues(a.id);
  }

  /**
   * Returns true if the countries `a` and `b` are neighbours.
   */
  neighbouring(a, b) {
    return this.graph.adjacent(a.id, b.id);
  }

  /**
   * Assigns the given players to random countries and returns a new world
   * state.
   */
  assignPlayers(players) {
    let as = F.sample(players.length, this.countries);

    let bs = as.map((country, index) =>
      F.copy(country, {player: players[index], armies: 2})
    );

    return F.set('graph', this.graph.merge(bs), this);
  }

  /**
   * Moves to the country `t` from the country `s` and returns a new world
   * state.
   */
  move(s, t) {
    core.log('World#move');

    // Calculate the number of armies to move.
    let n = F.min(s.armies - 1, t.slots.length);

    let u = F.set('armies', s.armies - n, s),
        v = F.copy(t, {armies: n, player: s.player});

    return F.set('graph', this.graph.merge([u, v]), this);
  }

  /**
   * Attacks the country `t` from the country `s` and returns a new world
   * state.
   */
  attack(s, t) {
    core.log('World#attack');

    // Roll the dice!
    let attackerDice = core.rollDice(s.armies),
        defenderDice = core.rollDice(t.armies);

    core.log('attacker: ' + attackerDice);
    core.log('defender: ' + defenderDice);

    // Calculate the number of defender dice with a value greater than or equal
    // to the corresponding attacker dice.
    let comparisons = F
      .zip(core.reverseSort(attackerDice), core.reverseSort(defenderDice))
      .map(F.uncurry(F.gte));

    // Calculate the casualties.
    let attackerCasualties = comparisons.filter(F.id).length,
        defenderCasualties = comparisons.filter(F.not).length;

    // Calculate the number of armies to move.
    let movers = F.min(s.armies - 1, t.slots.length);

    // Calculate the result.
    let as = F.sum(attackerDice) > F.sum(defenderDice) ?
      calculateWin() :
      calculateLose();

    return F.set('graph', this.graph.merge(as), this);

    function calculateWin() {
      let u = F.set('armies', s.armies - movers, s),
          v = F.copy(t, {armies: F.max(movers - attackerCasualties, 1), player: s.player});

      return [u, v];
    }

    function calculateLose() {
      let u = F.set('armies', F.max(s.armies - attackerCasualties, 1), s),
          v = F.set('armies', F.max(t.armies - defenderCasualties, 1), t);

      return [u, v];
    }
  }

  /**
   * Reinforces the given `player` and returns a new world state.
   */
  reinforce(player) {
    core.log('World#reinforce');

    let subgraphs = this.graph
      .filter(country => country.player === player)
      .connectedComponents();

    let depthIndex = reinforcement.depthIndex(this.graph, subgraphs);
    let reinforcementMap = reinforcement.reinforcementMap(this.graph, subgraphs, depthIndex);

    let graph = F.pairs(reinforcementMap).reduce((graph, [key, n]) => {
      return graph.update(key, country => country.reinforce(n));
    }, this.graph);

    return F.set('graph', graph, this);
  }
}
