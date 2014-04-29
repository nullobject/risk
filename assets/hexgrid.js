var _ = require('lodash');
var Core = require('./core')
var Hexagon = require('./hexagon')

function calculatePosition(origin, point, radius, padding) {
  var r = radius * Math.cos(Core.degreesToRadians(30));
  var h = radius * Math.sin(Core.degreesToRadians(30));
  var d = padding / 2 / Math.tan(Core.degreesToRadians(30));

  var width = (2 * r) + padding,
      height = radius + h + d;

  return {
    x: origin.x + (point[0] * width) + ((point[1] % 2) * (width / 2)),
    y: origin.y + (point[1] * height)
  };
}

var Hexgrid = function(cols, rows, radius, padding) {
  var points = Core.cartesianProduct(_.range(cols), _.range(rows));

  this.hexagons = points.map(function(point) {
    var position = calculatePosition({x: 0, y: 0}, point, radius, padding);
    return new Hexagon(position, radius);
  });
};

module.exports = Hexgrid;
