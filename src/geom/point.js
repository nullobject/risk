'use strict';

var Point = function() {
  var point = Object.create(Point.prototype);
  var a = arguments;

  if (a.length == 1) {
    if (a[0] instanceof Array) {
      point.x = a[0][0];
      point.y = a[0][1];
    } else {
      point.x = a[0].x;
      point.y = a[0].y;
    }
  } else if (a.length == 2) {
    point.x = a[0];
    point.y = a[1];
  }

  return point;
};

Point.prototype.constructor = Point;

Point.prototype.add = function(p) {
  return Point(this.x + p.x, this.y + p.y);
};

Point.prototype.divide = function(n) {
  return Point(this.x / n, this.y / n);
};

Point.zero = function() {
  return Point(0, 0);
};

Point.prototype.toString = function() {
  return this.x + ',' + this.y;
};

module.exports = Point;
