var _ = require('lodash');

function World(width, height, hexagons, countries, cells) {
  this.width     = width;
  this.height    = height;
  this.hexagons  = hexagons;
  this.countries = countries;
  this.cells     = cells;
}

World.prototype.constructor = World;

// Moves armies from the source country to the target country.
World.prototype.move = function(source, target) {
  console.log('World#move');

  // Assert the source country is in the world.
  if (!_.contains(this.countries, source)) {
    throw 'Source country is not in the world';
  }

  // Assert the target country is in the world.
  if (!_.contains(this.countries, target)) {
    throw 'Target country is not in the world';
  }

  // Assert the source country has enough armies.
  if (source.armies <= 1) {
    throw 'Source country does not have enough armies';
  }

  target.armies = source.armies - 1;
  source.armies = 1;
};

// Attacks with armies from the source country to the target country.
World.prototype.attack = function(from, to) {
  console.log('World#attack');
};

module.exports = World;
