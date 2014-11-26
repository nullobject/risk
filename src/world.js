import * as core from './core';
import * as graph from './graph';
import * as F from 'fkit';
import * as Immutable from 'immutable';

/**
 * Returns true if the country is occupied by the given player, false
 * otherwise.
 */
function occupiedBy(player) {
  return F.compose(F.equal(player), F.get('player'));
}

function calculateDepthMap(player, keys, graph) {
  return keys.reduce((map, key) => {
    let path = graph.shortestPathBy(country => country.player !== player, key);

    if (F.empty(path)) {
      throw "Can't calculate depth map from empty path."
    }

    return map.set(key, path.length - 2)
  }, Immutable.Map().asMutable()).toObject();
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
   *
   * This algorithm reinforces with a number of armies equal to the size of the
   * largest subgraph for the player.
   *
   * TODO: Construct a border depth map, where each node is mapped to its
   * distance from the border. Reinforce border countries for player islands
   * first, then if there are any remaining armies reinforce the rest of the
   * countries.
   *
   * To construct the border depth map perform a depth-first traversal from an
   * abritrary node. When the traversal hits a border country then mark its
   * depth as 0. Unfold the recursion to mark the rest of the nodes as depth
   * d+1 from the previous node. Repeat this process for all player nodes.
   */
  reinforce(player) {
    core.log('World#reinforce');

    let as = this.countriesOccupiedBy(player);

    // Calculate the player subgraphs.
    let subgraphs = this.graph
      .filter(country => country.player === player)
      .connectedComponents();

    let sortedSubgraphs = F.sortBy(core.bySizeDescending, subgraphs);

    let graph = F.head(sortedSubgraphs);

    console.log(sortedSubgraphs);

    let keys = F.concatMap(subgraph => subgraph.keys(), subgraphs);

    console.log(keys)

    let depthMap = calculateDepthMap(player, keys, this.graph);

    console.log(depthMap);

    let ds = reinforce_(graph.size);

    return F.set('graph', this.graph.merge(ds), this);

    function reinforce_(n) {
      // Calculate the availability list.
      let bs = as.map(F.get('availableSlots'));

      // Calculate the distribution list.
      let cs = core.distribute(n, bs);

      // Distribute the armies.
      return F
        .zip(cs, as)
        .map(F.uncurry(F.applyMethod('reinforce')));
    }
  }
}
