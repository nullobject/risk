'use strict';

var F         = require('fkit'),
    Immutable = require('immutable');

/*
 * Returns a new country.
 */
function Country(id, neighbourIds, polygon, slots) {
  var a = arguments;

  if (a.length > 0) {
    this.id           = id;
    this.neighbourIds = neighbourIds;
    this.polygon      = polygon;
    this.slots        = slots;
    this.armies       = 0;
    this.player       = null;
  }
}

Country.prototype.constructor = Country;

Object.defineProperty(Country.prototype, 'neighbourIds', {
  get: function() { return this.neighbourIdsSet.toArray(); },
  set: function(as) { this.neighbourIdsSet = Immutable.Set(as); }
});

Object.defineProperty(Country.prototype, 'availableSlots', {
  get: function() { return this.slots.length - this.armies; }
});

/*
 * Returns true if a given country neighbours this country, false otherwise.
 */
Country.prototype.hasNeighbour = function(country) {
  return this.neighbourIdsSet.contains(country.id);
};

Country.prototype.hashCode = function() {
  return this.id;
};

Country.prototype.toString = function() {
  return 'country-' + this.id;
};

Country.prototype.reinforce = function(n) {
  if (n <= 0) {
    return this;
  } else {
    var f = F.compose(F.min(this.slots.length), F.add(n));
    return F.update('armies', f, this);
  }
};

module.exports = Country;
