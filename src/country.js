'use strict';

var _ = require('lodash');

// The Country class represents a region on the map which can be occupied by a
// player.
function Country(polygon) {
  this.polygon = polygon;
  this.neighbours = [];
  this.armies = 2;
  this.player = null;
}

Country.prototype.constructor = Country;

Country.prototype.hasNeighbour = function(country) {
  return _.contains(this.neighbours, country);
};

Country.prototype.toString = function() {
  return 'country-' + this.id;
};

module.exports = Country;
