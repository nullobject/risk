import Point from './Point'
import Polygon from './Polygon'

describe('Polygon', () => {
  const polygon = new Polygon([
    new Point(-1, -1),
    new Point(-1, 1),
    new Point(1, 1),
    new Point(1, -1)
  ])

  describe('#containsPoint', () => {
    it('returns true if the polygon contains a given point', () => {
      expect(polygon.containsPoint(new Point(0, 0))).toBe(true)
    })

    it('returns false if the polygon does not contain a given point', () => {
      expect(polygon.containsPoint(new Point(2, 2))).toBe(false)
    })
  })
})
