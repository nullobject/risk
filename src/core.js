'use strict';

var Immutable = require('immutable'),
    fn        = require('fn.js');

module.exports = {
  log: function(message) {
    if (process.env.NODE_ENV === 'development') {
      console.log(message);
    }
  },

  // Flattens a given array.
  flatten: function(array) {
    var index  = -1,
        length = array ? array.length : 0,
        result = [];

    while (++index < length) {
      var value = array[index];

      if (Array.isArray(value)) {
        var valIndex  = -1,
            valLength = value.length,
            resIndex  = result.length;

        result.length += valLength;
        while (++valIndex < valLength) {
          result[resIndex++] = value[valIndex];
        }
      } else {
        result.push(value);
      }
    }

    return result;
  },

  // Returns the cartesian product of a given collection of arrays.
  cartesianProduct: function() {
    var _this = this;
    return fn.toArray(arguments).reduce(function(a, b) {
      return _this.flatten(a.map(function(x) {
        return b.map(function(y) {
          return x.concat([y]);
        });
      }));
    }, [[]]);
  },

  degreesToRadians: function(degrees) {
    return degrees * Math.PI / 180;
  },

  randomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomFloat: function(min, max) {
    return Math.random() * (max - min) + min;
  },

  range: function(n) {
    return Immutable.Range().take(n).toArray();
  },

  // Samples a given number of elements from a collection.
  sample: function(n, collection) {
    return this.range(n).map(function() {
      var index = this.randomInt(0, collection.length - 1);
      return collection[index];
    }, this);
  },

  inc: fn.op['++'],
  dec: fn.op['--']
};
