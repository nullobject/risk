var Point = function(x, y) {
  this.x = x;
  this.y = y;
};

Point.prototype.constructor = Point;

// Uppercase accessor for Clipper.js compatibility.
Object.defineProperty(Point.prototype, "X", {
  get: function() { return this.x; }
});

// Uppercase accessor for Clipper.js compatibility.
Object.defineProperty(Point.prototype, "Y", {
  get: function() { return this.y; }
});

module.exports = Point;
