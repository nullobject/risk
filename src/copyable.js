'use strict';

var F = require('fkit');

function Copyable() {}

// Sets the given properties and returns a copy of the object.
Copyable.prototype.copy = function(ps) {
  return F.copy(this, ps);
};

// Sets a given property to a value and returns a copy of the object.
Copyable.prototype.set = function(property, value) {
  return F.set(property, value, this);
};

// Updates a given property with a function and returns a copy of the object.
Copyable.prototype.update = function(property, updater) {
  return F.update(property, updater, this);
};

Copyable.prototype.constructor = Copyable;

module.exports = Copyable;
