'use strict';

var Point = function() {
  var a = arguments;

  if (a.length == 1) {
    if (a[0] instanceof Array) {
      this.x = a[0][0];
      this.y = a[0][1];
    } else {
      this.x = a[0].x;
      this.y = a[0].y;
    }
  } else if (a.length == 2) {
    this.x = a[0];
    this.y = a[1];
  }
};

Point.prototype.constructor = Point;

Point.prototype.add = function(p) {
  return new Point(this.x + p.x, this.y + p.y);
};

Point.prototype.divide = function(n) {
  return new Point(this.x / n, this.y / n);
};

Point.zero = function() {
  return new Point(0, 0);
};

Point.prototype.toString = function() {
  return this.x + ',' + this.y;
};

module.exports = Point;
