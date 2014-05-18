function World(width, height, hexagons, countries, cells) {
  this.width     = width;
  this.height    = height;
  this.hexagons  = hexagons;
  this.countries = countries;
  this.cells     = cells;
}

World.prototype.constructor = World;

module.exports = World;
