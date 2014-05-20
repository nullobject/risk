'use strict';

function Country(polygon) {
  this.polygon = polygon;
  this.neighbours = [];
  this.armies = 10;
}

Country.prototype.constructor = Country;

module.exports = Country;
