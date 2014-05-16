var Point = function() {
  var a = arguments;

  if (a.length == 2) {
    this.x = a[0];
    this.y = a[1];
  } else if (a.length == 1) {
    this.x = a[0][0];
    this.y = a[0][1];
  }
};

Point.prototype.constructor = Point;

module.exports = Point;
