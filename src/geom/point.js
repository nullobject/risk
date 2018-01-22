/**
 * Returns a new point with the given coordinates.
 */
export default class Point {
  constructor () {
    const a = arguments

    if (a.length === 1) {
      if (Array.isArray(a[0])) {
        this.x = a[0][0]
        this.y = a[0][1]
      } else {
        this.x = a[0].x
        this.y = a[0].y
      }
    } else if (a.length === 2) {
      this.x = a[0]
      this.y = a[1]
    }
  }

  add (p) {
    return new Point(this.x + p.x, this.y + p.y)
  }

  divide (n) {
    return new Point(this.x / n, this.y / n)
  }

  distance (p) {
    const dx = this.x - p.x
    const dy = this.y - p.y

    return Math.sqrt((dx * dx) + (dy * dy))
  }

  toString () {
    return this.x + ',' + this.y
  }

  /**
   * Returns a new point at the origin.
   */
  static zero () {
    return new Point(0, 0)
  }
}
