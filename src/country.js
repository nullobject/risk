function Country(polygon) {
  this.armies = 10;
  this.polygon = polygon;
}

Country.prototype.constructor = Country;

// Calculates the neighbouring countries.
Country.prototype.calculateNeighbouringCountries = function(countries) {
  var self = this;
  this.neighbours = countries.filter(function(neighbour) {
    return neighbour.region.neighbours.some(function(region) {
      return region === self.region;
    });
  });
};

module.exports = Country;
