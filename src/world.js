'use strict';

var core      = require('./core'),
    F         = require('fkit'),
    Immutable = require('immutable');

// Returns a new world.
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
  set: function(as) { this.countriesSet = Immutable.Set.from(as); }
});

/*
 * Returns the countries occupied by a player.
 */
World.prototype.countriesOccupiedByPlayer = function(player) {
  return this.countriesSet.filter(occupiedByPlayer(player)).toArray();

  // Returns true if the country is occupied by the given player, false otherwise.
  function occupiedByPlayer(player) { return F.compose(F.equal(player), F.get('player')); }
};

/*
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

/*
 * Moves to the country `t` from the country `s` and returns a new world state.
 */
World.prototype.move = function(s, t) {
  core.log('World#move');

  var n = F.min(s.armies - 1, t.slots.length),
      u = F.set('armies', s.armies - n, s),
      v = F.copy(t, {armies: n, player: s.player});

  return F.update('countriesSet', core.replace([s, t], [u, v]), this);
};

/*
 * Attacks the country `t` from the country `s` and returns a new world state.
 */
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

/*
 * Reinforces the countries in the list of `as` and returns a new world state.
 */
World.prototype.reinforce = function(as) {
  core.log('World#reinforce');

  // Calculate the availability list.
  var bs = as.map(F.get('availableSlots'));

  // Calculate the distribution list.
  var cs = core.distribute(bs.length, bs);

  // Distribute the armies.
  var ds = F
    .zip(cs, as)
    .map(F.uncurry(F.applyMethod('reinforce')));

  return F.update('countriesSet', core.replace(as, ds), this);
};

module.exports = World;
