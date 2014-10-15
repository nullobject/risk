'use strict';

var core      = require('./core'),
    Copyable  = require('./copyable'),
    F         = require('fkit'),
    Immutable = require('immutable');


// Returns a new world.
function World(width, height, hexgrid, countries, cells) {
  var a = arguments;

  if (a.length > 0) {
    this.width     = width;
    this.height    = height;
    this.hexgrid   = hexgrid;
    this.countries = Immutable.Set.from(countries);
    this.cells     = cells;
  }
}

World.prototype = new Copyable();

World.prototype.constructor = World;

// Returns the countries occupied by a player.
World.prototype.countriesOccupiedByPlayer = function(player) {
  return this.countries.filter(function(country) {
    return country.player === player;
  });
};

// Assigns the given players to random countries and returns a new world
// state.
World.prototype.assignPlayers = function(players) {
  var playerCountries = F.sample(players.length, this.countries.toArray());

  var newPlayerCountries = playerCountries.map(function(country, index) {
    return country.set('player', players[index]);
  });

  var countries = this.countries.withMutations(function(set) {
    set.subtract(playerCountries).union(newPlayerCountries);
  });

  return this.set('countries', countries);
};

// Moves a given player's armies between two countries and returns a new
// world state.
World.prototype.move = function(player, from, to) {
  core.log('World#move');

  var newFrom = from.set('armies', 1),
      newTo   = to.copy({armies: from.armies - 1, player: from.player});

  var countries = this.countries.withMutations(function(set) {
    set.subtract([from, to]).union([newFrom, newTo]);
  });

  return this.set('countries', countries);
};

// Reinforces the countries occupied by the given player and returns a new
// world state.
World.prototype.reinforce = function(player) {
  core.log('World#reinforce');

  var playerCountries = this.countriesOccupiedByPlayer(player);

  var newPlayerCountries = playerCountries.map(function(country) {
    return country.update('armies', F.inc);
  });

  var countries = this.countries.withMutations(function(set) {
    set.subtract(playerCountries).union(newPlayerCountries);
  });

  return this.set('countries', countries);
};

module.exports = World;
