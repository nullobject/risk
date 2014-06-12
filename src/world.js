'use strict';

// The World class represents the world map on which the game is played.
function World(hexagons, countries, cells) {
  this.hexagons  = hexagons;
  this.countries = countries;
  this.cells     = cells;
}

World.prototype.constructor = World;

module.exports = World;
