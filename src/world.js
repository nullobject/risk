'use strict';

var _ = require('lodash');

function validateAction(countries, from, to) {
  // Assert the from country is in the world.
  if (!_.contains(countries, from)) {
    throw new Error("The 'from' country is not in the world");
  }

  // Assert the to country is in the world.
  if (!_.contains(countries, to)) {
    throw new Error("The 'to' country is not in the world");
  }

  // Assert the from country has enough armies.
  if (from.armies <= 1) {
    throw new Error("The 'from' country does not have enough armies");
  }
}

// The world class represents the world map on which the game is played.
function World(hexagons, countries, cells) {
  this.hexagons  = hexagons;
  this.countries = countries;
  this.cells     = cells;
}

World.prototype.constructor = World;

// Moves armies from/to a given country.
World.prototype.move = function(from, to) {
  console.log('World#move');

  validateAction(this.countries, from, to);

  to.armies = from.armies - 1;
  to.player = from.player;
  from.armies = 1;
};

module.exports = World;
