'use strict';

var fn = require('fn.js');

function Copyable() {}

// Sets the given properties and returns a copy of the object.
Copyable.prototype.copy = function() {
  return fn.concat(this, fn.toArray(arguments)).reduce(function(object, value) {
    fn.properties(value).forEach(function(property) {
      object[property] = value[property];
    });
    return object;
  }, new this.constructor());
};

// Sets a given property to a value and returns a copy of the object.
Copyable.prototype.set = function(property, value) {
  var object = {};
  object[property] = value;
  return this.copy(object);
};

// Updates a given property with a function and returns a copy of the object.
Copyable.prototype.update = function(property, updater) {
  return this.set(property, updater(this[property]));
};

Copyable.prototype.constructor = Copyable;

module.exports = Copyable;
