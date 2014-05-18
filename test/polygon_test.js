var Point   = require('../src/point');
var Polygon = require('../src/polygon');
var expect  = require('chai').expect;

function p(x, y) {
  return new Point(x, y);
}

describe('Polygon', function() {
  var polygon = new Polygon([
    p(-1, -1),
    p(-1,  1),
    p( 1,  1),
    p( 1, -1)
  ]);

  describe('#containsPoint', function() {
    it('should return true if the polygon contains a given point', function() {
      expect(polygon.containsPoint(p(0, 0))).to.be.true;
    });

    it('should return false if the polygon does not contain a given point', function() {
      expect(polygon.containsPoint(p(2, 2))).to.be.false;
    });
  });
});
