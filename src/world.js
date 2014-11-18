'use strict';

var core      = require('./core'),
    graph     = require('./graph'),
    F         = require('fkit'),
    Immutable = require('immutable');

var reverseSort = F.compose(F.reverse, F.sort);

/**
 * Returns true if the country is occupied by the given player, false
 * otherwise.
 */
var occupiedBy = function(player) {
  return F.compose(F.equal(player), F.get('player'));
};

/**
 * Creates a new world.
 */
function World(width, height, hexgrid, countries, cells) {
  var a = arguments;

  if (a.length > 0) {
    this.width     = width;
    this.height    = height;
    this.hexgrid   = hexgrid;
    this.countries = countries;
    this.cells     = cells;
  }
}

World.prototype.constructor = World;

Object.defineProperty(World.prototype, 'countries', {
  get: function() { return this.countriesMap.toArray(); },
  set: function(as) { this.countriesMap = core.mapFromObjects(as); }
});

/**
 * Returns the countries occupied by a player.
 */
World.prototype.countriesOccupiedBy = function(player) {
  return this.countries.filter(occupiedBy(player));
};

/**
 * Returns the countries neighbouring a country.
 */
World.prototype.countriesNeighbouring = function(a) {
  return this.countries.filter(function(b) { return a.hasNeighbour(b); });
};

/**
 * Assigns the given players to random countries and returns a new world state.
 */
World.prototype.assignPlayers = function(players) {
  var as = F.sample(players.length, this.countries);

  var bs = as.map(function(country, index) {
    return F.copy(country, {
      player: players[index],
      armies: 2
    });
  });

  return F.update('countriesMap', core.mergeObjects(bs), this);
};

/**
 * Moves to the country `t` from the country `s` and returns a new world state.
 */
World.prototype.move = function(s, t) {
  core.log('World#move');

  // Calculate the number of armies to move.
  var n = F.min(s.armies - 1, t.slots.length);

  var u = F.set('armies', s.armies - n, s),
      v = F.copy(t, {armies: n, player: s.player});

  return F.update('countriesMap', core.mergeObjects([u, v]), this);
};

/**
 * Attacks the country `t` from the country `s` and returns a new world state.
 */
World.prototype.attack = function(s, t) {
  core.log('World#attack');

  // Roll the dice!
  var attackerDice = core.rollDice(s.armies),
      defenderDice = core.rollDice(t.armies);

  core.log('attacker: ' + attackerDice);
  core.log('defender: ' + defenderDice);

  // Calculate the number of defender dice with a value greater than or equal
  // to the corresponding attacker dice.
  var comparisons = F
    .zip(reverseSort(attackerDice), reverseSort(defenderDice))
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
};

/**
 * Reinforces the given `player` and returns a new world state.
 *
 * TODO: Construct a border depth map, where each node is mapped to its
 * distance from the border. Reinforce border countries for player islands,
 * then reinforce the remaining countries.
 */
World.prototype.reinforce = function(player) {
  core.log('World#reinforce');

  // Create an adjacency function.
  var f = function(country) {
    return country.neighbourIds
      .map(function(id) { return this.countriesMap.get(id); }, this)
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
};

module.exports = World;
