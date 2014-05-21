'use strict';

function Country(polygon) {
  this.polygon = polygon;
  this.neighbours = [];
  this.armies = 10;
}

Country.prototype.constructor = Country;

Country.prototype.toString = function() {
  return 'country-' + this.id;
};

module.exports = Country;
