'use strict';

var Copyable  = require('./copyable'),
    Immutable = require('immutable'),
    core      = require('./core');

// Returns a new country.
function Country(id, neighbourIds, polygon) {
  var a = arguments;

  if (a.length > 0) {
    this.id           = id;
    this.neighbourIds = Immutable.Set.from(neighbourIds);
    this.polygon      = polygon;
    this.armies       = 2;
    this.player       = null;
  }
}

Country.prototype = new Copyable();

Country.prototype.constructor = Country;

// Returns true if a given country neighbours this country, false otherwise.
Country.prototype.hasNeighbour = function(country) {
  return this.neighbourIds.contains(country.id);
};

Country.prototype.hashCode = function() {
  return this.id;
};

Country.prototype.toString = function() {
  return 'country-' + this.id;
};

module.exports = Country;
