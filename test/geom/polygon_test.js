import Point from '../../src/geom/point';
import Polygon from '../../src/geom/polygon';

describe('Polygon', () => {
  var polygon = new Polygon([
    new Point(-1, -1),
    new Point(-1,  1),
    new Point( 1,  1),
    new Point( 1, -1)
  ]);

  describe('#containsPoint', () => {
    it('should return true if the polygon contains a given point', () => {
      expect(polygon.containsPoint(new Point(0, 0))).to.be.true;
    });

    it('should return false if the polygon does not contain a given point', () => {
      expect(polygon.containsPoint(new Point(2, 2))).to.be.false;
    });
  });
});
