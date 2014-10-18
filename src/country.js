'use strict';

var F         = require('fkit'),
    Immutable = require('immutable');

// Returns a new country.
function Country(id, neighbourIds, polygon, slots) {
  var a = arguments;

  if (a.length > 0) {
    this.id              = id;
    this.neighbourIdsSet = Immutable.Set.from(neighbourIds);
    this.polygon         = polygon;
    this.slots           = slots;
    this.armies          = 0;
    this.player          = null;
  }
}

Country.prototype.constructor = Country;

// Returns true if a given country neighbours this country, false otherwise.
Country.prototype.hasNeighbour = function(country) {
  return this.neighbourIdsSet.contains(country.id);
};

Country.prototype.hashCode = function() {
  return this.id;
};

Country.prototype.toString = function() {
  return 'country-' + this.id;
};

Country.prototype.reinforce = function() {
  var armies = F.min(this.slots.length, F.inc(this.armies));
  return F.set('armies', armies, this);
};

module.exports = Country;
