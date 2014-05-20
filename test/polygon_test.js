var Point   = require('../src/point');
var Polygon = require('../src/polygon');
var expect  = require('chai').expect;

describe('Polygon', function() {
  var polygon = Polygon([
    Point(-1, -1),
    Point(-1,  1),
    Point( 1,  1),
    Point( 1, -1)
  ]);

  describe('#containsPoint', function() {
    it('should return true if the polygon contains a given point', function() {
      expect(polygon.containsPoint(Point(0, 0))).to.be.true;
    });

    it('should return false if the polygon does not contain a given point', function() {
      expect(polygon.containsPoint(Point(2, 2))).to.be.false;
    });
  });
});
