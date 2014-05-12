function Country(vertices) {
  vertices.__proto__ = Country.prototype;
  vertices.armies = 10;
  return vertices;
}

Country.prototype = [];

// Calculates the neighbouring countries.
Country.prototype.calculateNeighbouringCountries = function(countries) {
  var self = this;
  this.neighbours = countries.filter(function(neighbour) {
    return neighbour.region.neighbours.some(function(region) {
      return region === self.region;
    });
  });
}

module.exports = Country;
