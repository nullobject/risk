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

export default class World {
  constructor(width, height, hexgrid, countries, cells) {
    var a = arguments;

    if (a.length > 0) {
      this.width     = width;
      this.height    = height;
      this.hexgrid   = hexgrid;
      this.countries = countries;
      this.cells     = cells;
    }
  }

  get countries() { return this.countriesMap.toArray(); }
  set countries(as) { this.countriesMap = core.mapFromObjects(as); }

  /**
   * Returns the countries occupied by a player.
   */
  countriesOccupiedBy(player) {
    return this.countries.filter(occupiedBy(player));
  }

  /**
   * Returns the countries neighbouring a country.
   */
  countriesNeighbouring(a) {
    return this.countries.filter(b => { return a.hasNeighbour(b); });
  }

  /**
   * Assigns the given players to random countries and returns a new world
   * state.
   */
  assignPlayers(players) {
    var as = F.sample(players.length, this.countries);

    var bs = as.map((country, index) => {
      return F.copy(country, {
        player: players[index],
        armies: 2
      });
    });

    return F.update('countriesMap', core.mergeObjects(bs), this);
  }

  /**
   * Moves to the country `t` from the country `s` and returns a new world
   * state.
   */
  move(s, t) {
    core.log('World#move');

    // Calculate the number of armies to move.
    var n = F.min(s.armies - 1, t.slots.length);

    var u = F.set('armies', s.armies - n, s),
        v = F.copy(t, {armies: n, player: s.player});

    return F.update('countriesMap', core.mergeObjects([u, v]), this);
  }

  /**
   * Attacks the country `t` from the country `s` and returns a new world
   * state.
   */
  attack(s, t) {
    core.log('World#attack');

    // Roll the dice!
    var attackerDice = core.rollDice(s.armies),
        defenderDice = core.rollDice(t.armies);

    core.log('attacker: ' + attackerDice);
    core.log('defender: ' + defenderDice);

    // Calculate the number of defender dice with a value greater than or equal
    // to the corresponding attacker dice.
    var comparisons = F
      .zip(core.reverseSort(attackerDice), core.reverseSort(defenderDice))
      .map(F.uncurry(F.gte));

    // Calculate the casualties.
    var attackerCasualties = comparisons.filter(F.id).length,
        defenderCasualties = comparisons.filter(F.not).length;

    // Calculate the number of armies to move.
    var movers = F.min(s.armies - 1, t.slots.length);

    var u, v;

    if (F.sum(attackerDice) > F.sum(defenderDice)) {
      u = F.set('armies', s.armies - movers, s);
      v = F.copy(t, {armies: F.max(movers - attackerCasualties, 1), player: s.player});
    } else {
      u = F.set('armies', F.max(s.armies - attackerCasualties, 1), s);
      v = F.set('armies', F.max(t.armies - defenderCasualties, 1), t);
    }

    return F.update('countriesMap', core.mergeObjects([u, v]), this);
  }

  /**
   * Reinforces the given `player` and returns a new world state.
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

    // Create an adjacency function.
    var f = country => {
      return country.neighbourIds
        .map(id => { return this.countriesMap.get(id); }, this)
        .filter(occupiedBy(player));
    };

    var as = this.countriesOccupiedBy(player);

    // Find the largest player island.
    var island = F.compose(
      graph.findLargestIsland,
      graph.calculateIslands(f.bind(this))
    )(as);

    var ds = reinforce_(island.length);

    return F.update('countriesMap', core.mergeObjects(ds), this);

    function reinforce_(n) {
      // Calculate the availability list.
      var bs = as.map(F.get('availableSlots'));

      // Calculate the distribution list.
      var cs = core.distribute(n, bs);

      // Distribute the armies.
      return F
        .zip(cs, as)
        .map(F.uncurry(F.applyMethod('reinforce')));
    }
  }
}
