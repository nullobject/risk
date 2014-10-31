'use strict';

/*
 * Returns a new point with the given coordinates.
 */
var Point = function() {
  var x, y, a = arguments;

  if (a.length === 1) {
    if (Array.isArray(a[0])) {
      x = a[0][0];
      y = a[0][1];
    } else {
      x = a[0].x;
      y = a[0].y;
    }
  } else if (a.length === 2) {
    x = a[0];
    y = a[1];
  }

  return {
    x: x,
    y: y,

    add: function(p) {
      return Point(this.x + p.x, this.y + p.y);
    },

    divide: function(n) {
      return Point(this.x / n, this.y / n);
    },

    distance: function(p) {
      var dx = this.x - p.x,
          dy = this.y - p.y;

      return Math.sqrt((dx * dx) + (dy * dy));
    },

    toString: function() {
      return this.x + ',' + this.y;
    }
  };
};

/*
 * Returns a new point at the origin.
 */
Point.zero = function() {
  return Point(0, 0);
};

module.exports = Point;
