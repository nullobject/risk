'use strict';

var Point   = require('../../src/geom/point'),
    Polygon = require('../../src/geom/polygon');

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
