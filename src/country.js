function Country(polygon) {
  this.polygon = polygon;
  this.neighbours = [];
}

Country.prototype.constructor = Country;

module.exports = Country;
