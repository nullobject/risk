function World(hexagons, countries, cells) {
  this.hexagons        = hexagons;
  this.countries       = countries;
  this.cells           = cells;
  this.selectedCountry = null;
}

World.prototype.constructor = World;

module.exports = World;
