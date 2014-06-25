'use strict';

// The World class represents the world map on which the game is played.
function World(hexgrid, countries, cells) {
  this.hexgrid   = hexgrid;
  this.countries = countries;
  this.cells     = cells;
}

World.prototype.constructor = World;

module.exports = World;
