'use strict';

var core      = require('./core'),
    F         = require('fkit'),
    Immutable = require('immutable');

var reverseSort = F.compose(F.reverse, F.sort);

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
  get: function() { return this.countriesSet.toArray(); },
  set: function(as) { this.countriesSet = Immutable.Set(as); }
});

/**
 * Returns the countries occupied by a player.
 */
World.prototype.countriesOccupiedByPlayer = function(player) {
  return this.countries.filter(occupiedByPlayer(player));

  // Returns true if the country is occupied by the given player, false otherwise.
  function occupiedByPlayer(player) { return F.compose(F.equal(player), F.get('player')); }
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

  return F.update('countriesSet', core.replace(as, bs), this);
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

  return F.update('countriesSet', core.replace([s, t], [u, v]), this);
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

  return F.update('countriesSet', core.replace([s, t], [u, v]), this);
};

/**
 * Calculates islands of connected countries using a depth-first travsersal.
 *
 * @curried
 * @function
 */
var calculatePlayerIslands = F.curry(function(player, countries) {
  var countriesMap = core.idMap(countries),
      countriesSet = Immutable.Set(countries),
      islandsSet   = Immutable.Set();

  return calculateIslands_(countriesSet, islandsSet).toArray();

  function calculateIslands_(remainingCountriesSet, islandsSet) {
    if (remainingCountriesSet.size > 0) {
      var nodes = function(country) {
        return country.neighbourIds
          .map(function(id) { return countriesMap.get(id); })
          .filter(F.notEqual(undefined));
      };

      var island = core.traverse(remainingCountriesSet.first(), nodes);

      // Add the island to the islands set.
      islandsSet = islandsSet.add(island);

      // Remove the island from the remaining countries set.
      remainingCountriesSet = remainingCountriesSet.subtract(island);

      // Recurse with the remaining countries set.
      islandsSet = calculateIslands_(remainingCountriesSet, islandsSet);
    }

    return islandsSet;
  }
});

/**
 * Finds the largest island.
 *
 * @function
 * @param as The list of islands.
 * @returns The largest island.
 */
var findLargestIsland = F.maximumBy(function(a, b) { return a.length > b.length; });

/**
 * Reinforces the countries in the list of `as` and returns a new world state.
 *
 * TODO: Reinforce leaf countries for player islands. Then reinforce the
 * remaining countries.
 */
World.prototype.reinforce = function(player) {
  core.log('World#reinforce');

  var as = this.countriesOccupiedByPlayer(player);

  // Find the largest player island.
  var island = F.compose(findLargestIsland, calculatePlayerIslands(player))(as);

  var ds = reinforce_(player, island.length);

  return F.update('countriesSet', core.replace(as, ds), this);

  function reinforce_(player, n) {
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
