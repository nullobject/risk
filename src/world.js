'use strict';

var core      = require('./core'),
    F         = require('fkit'),
    Immutable = require('immutable');

// Replaces `as` with `bs` in the set `c`.
var replace = F.curry(function(as, bs, c) {
  return c.withMutations(function(set) {
    set.subtract(as).union(bs);
  });
});

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

  return F.update('countriesSet', replace(as, bs), this);
};

// Moves to the `target` country from the `source` country and returns a new
// world state.
World.prototype.move = function(s, t) {
  core.log('World#move');

  var u = F.set('armies', 1, s),
      v = F.copy(t, {player: s.player, armies: F.dec(s.armies)});

  return F.update('countriesSet', replace([s, t], [u, v]), this);
};

// Attacks the `target` country from the `source` country and returns a new
// world state.
World.prototype.attack = function(s, t) {
  core.log('World#attack');

  var attackDice = core.rollDice(s.armies),
      defendDice = core.rollDice(t.armies),
      attack     = F.sum(attackDice),
      defend     = F.sum(defendDice);

  var u = F.set('armies', 1, s);

  var v = attack > defend ?
    F.copy(t, {player: s.player, armies: F.dec(s.armies)}) :
    t;

  return F.update('countriesSet', replace([s, t], [u, v]), this);
};

// Reinforces the countries occupied by the given player and returns a new
// world state.
World.prototype.reinforce = function(player) {
  core.log('World#reinforce');

  var as = this.countriesOccupiedByPlayer(player),
      bs = as.map(F.applyProp('reinforce', 1));

  return F.update('countriesSet', replace(as, bs), this);
};

module.exports = World;
