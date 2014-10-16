'use strict';

var core      = require('./core'),
    F         = require('fkit'),
    Immutable = require('immutable');

// Returns a new world.
function World(width, height, hexgrid, countries, cells) {
  var a = arguments;

  if (a.length > 0) {
    this.width        = width;
    this.height       = height;
    this.hexgrid      = hexgrid;
    this.countriesSet = Immutable.Set.from(countries);
    this.cells        = cells;
  }
}

World.prototype.constructor = World;

Object.defineProperty(World.prototype, 'countries', {
  get: function() { return this.countriesSet.toArray(); }
});

// Returns the countries occupied by a player.
World.prototype.countriesOccupiedByPlayer = function(player) {
  return this.countriesSet.filter(F.compose(F.equal(player), F.get('player')));
};

// Assigns the given players to random countries and returns a new world
// state.
World.prototype.assignPlayers = function(players) {
  var playerCountries = F.sample(players.length, this.countries);

  var newPlayerCountries = playerCountries.map(function(country, index) {
    return F.set('player', players[index], country);
  });

  var countriesSet = this.countriesSet.withMutations(function(set) {
    set.subtract(playerCountries).union(newPlayerCountries);
  });

  return F.set('countriesSet', countriesSet, this);
};

// Moves a given player's armies between two countries and returns a new
// world state.
World.prototype.move = function(player, from, to) {
  core.log('World#move');

  var newFrom = F.set('armies', 1, from),
      newTo   = F.copy(to, {player: from.player, armies: F.dec(from.armies)});

  var countriesSet = this.countriesSet.withMutations(function(set) {
    set.subtract([from, to]).union([newFrom, newTo]);
  });

  return F.set('countriesSet', countriesSet, this);
};

// Reinforces the countries occupied by the given player and returns a new
// world state.
World.prototype.reinforce = function(player) {
  core.log('World#reinforce');

  var playerCountries = this.countriesOccupiedByPlayer(player);

  var newPlayerCountries = playerCountries.map(F.update('armies', F.inc));

  var countriesSet = this.countriesSet.withMutations(function(set) {
    set.subtract(playerCountries).union(newPlayerCountries);
  });

  return F.set('countriesSet', countriesSet, this);
};

module.exports = World;
