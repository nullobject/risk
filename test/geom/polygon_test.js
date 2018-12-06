import Point from '../../src/geom/point'
import Polygon from '../../src/geom/polygon'
import { assert } from 'chai'

describe('Polygon', () => {
  const polygon = new Polygon([
    new Point(-1, -1),
    new Point(-1, 1),
    new Point(1, 1),
    new Point(1, -1)
  ])

  describe('#containsPoint', () => {
    it('returns true if the polygon contains a given point', () => {
      assert.isTrue(polygon.containsPoint(new Point(0, 0)))
    })

    it('returns false if the polygon does not contain a given point', () => {
      assert.isFalse(polygon.containsPoint(new Point(2, 2)))
    })
  })
})
