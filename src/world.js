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

// Moves to the `target` country from the `source` country and returns a new
// world state.
World.prototype.move = function(s, t) {
  core.log('World#move');

  var u = F.set('armies', 1, s),
      v = F.copy(t, {player: s.player, armies: F.dec(s.armies)});

  var countriesSet = this.countriesSet.withMutations(function(set) {
    set.subtract([s, t]).union([u, v]);
  });

  return F.set('countriesSet', countriesSet, this);
};

// Attacks the `target` country from the `source` country and returns a new
// world state.
World.prototype.attack = function(s, t) {
  core.log('World#attack');

  var a = F.sum(core.rollDice(s.armies)),
      b = F.sum(core.rollDice(t.armies));

  var u, v;

  if (a > b) {
    u = F.set('armies', 1, s);
    v = F.copy(t, {player: s.player, armies: F.dec(s.armies)});
  } else {
    u = F.set('armies', 1, s);
    v = t;
  }

  var countriesSet = this.countriesSet.withMutations(function(set) {
    set.subtract([s, t]).union([u, v]);
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
