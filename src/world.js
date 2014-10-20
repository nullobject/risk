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
  var as = F.sample(players.length, this.countries);

  var bs = as.map(function(country, index) {
    return F.copy(country, {
      player: players[index],
      armies: 2
    });
  });

  return F.update('countriesSet', core.replace(as, bs), this);
};

// Moves to the `target` country from the `source` country and returns a new
// world state.
World.prototype.move = function(s, t) {
  core.log('World#move');

  var n = F.min(s.armies - 1, t.slots.length),
      u = F.set('armies', s.armies - n, s),
      v = F.copy(t, {armies: n, player: s.player});

  return F.update('countriesSet', core.replace([s, t], [u, v]), this);
};

// Attacks the `target` country from the `source` country and returns a new
// world state.
World.prototype.attack = function(s, t) {
  core.log('World#attack');

  var attackDice = core.rollDice(s.armies),
      defendDice = core.rollDice(t.armies),
      attack     = F.sum(attackDice),
      defend     = F.sum(defendDice);

  var u, v;

  if (attack > defend) {
    var n = F.min(s.armies - 1, t.slots.length);
    u = F.set('armies', s.armies - n, s);
    v = F.copy(t, {armies: n, player: s.player});
  } else {
    u = F.set('armies', 1, s);
    v = F.set('armies', 1, t);
  }

  return F.update('countriesSet', core.replace([s, t], [u, v]), this);
};

// Distributes `n` armies to the list of `countries`.
// TODO: If some countries have no slots available then distribute the armies.
function distributeArmies(n, countries) {
  return countries.map(F.applyMethod('reinforce', 1));
}

// Reinforces the countries occupied by the given player and returns a new
// world state.
World.prototype.reinforce = function(player) {
  core.log('World#reinforce');

  var as = this.countriesOccupiedByPlayer(player),
      bs = distributeArmies(as.length, as);

  return F.update('countriesSet', core.replace(as, bs), this);
};

module.exports = World;
