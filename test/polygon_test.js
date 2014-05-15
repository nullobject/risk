var expect = require('chai').expect;

var Polygon = require('../src/polygon');

describe('Polygon', function() {
  var p = new Polygon([[-1, -1], [-1, 1], [1, 1], [1, -1]]);

  describe('#containsPoint', function() {
    it('should return true if the polygon contains a given point', function() {
      expect(p.containsPoint([0, 0])).to.be.true;
    });

    it('should return false if the polygon does not contain a given point', function() {
      expect(p.containsPoint([2, 2])).to.be.false;
    });
  });
});
