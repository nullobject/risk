import { cartesian, compose, curry, range } from 'fkit'

import Point from './point'
import Polygon from './polygon'

function degreesToRadians (degrees) {
  return degrees * Math.PI / 180
}

/**
 * Calculates the position of a hexagon at a given coordinate.
 */
function calculatePosition ([col, row], width, height) {
  return new Point(
    (col * width) + ((row % 2) * (width / 2)),
    row * height
  )
}

/**
 * Calculates the vertices of a hexagon at a given position.
 */
function calculateVertices (position, r, h, radius) {
  return [
    new Point(position.x, position.y + h),
    new Point(position.x + r, position.y),
    new Point(position.x + (2 * r), position.y + h),
    new Point(position.x + (2 * r), position.y + h + radius),
    new Point(position.x + r, position.y + (2 * h) + radius),
    new Point(position.x, position.y + h + radius)
  ]
}

/**
 * Returns a new hexgrid with cells of a given radius.
 *
 * See http://www.redblobgames.com/grids/hexagons
 */
export default class Hexgrid {
  constructor (radius) {
    this.padding = 0
    this.radius = radius

    // Precalculate values.
    this.r = this.radius * Math.cos(degreesToRadians(30))
    this.h = this.radius * Math.sin(degreesToRadians(30))
    this.d = this.padding / 2 / Math.tan(degreesToRadians(30))

    // Calculate the dimensions of a hexagon.
    this.width = (2 * this.r) + this.padding
    this.height = this.radius + this.h + this.d

    // Calculates the vertices of a hexagon at a given coordinate.
    this.hexagonVertices = curry((origin, coordinate) => {
      const position = calculatePosition(coordinate, this.width, this.height)
      return calculateVertices(origin.add(position), this.r, this.h, this.radius)
    })
  }

  /**
   * Returns an array of polygons which represent a hexgrid of a given size
   * (rows & cols).
   */
  build (size, offset) {
    // Generate the coordinates of the cells in the hexgrid.
    const coordinates = cartesian(range(0, size[0]), range(0, size[1]))

    // Calculate the origin of the hexgrid.
    const origin = new Point(this.width * offset[0], this.height * offset[1])

    // Create haxagons for every coordinate.
    return coordinates.map(compose(vertices => new Polygon(vertices), this.hexagonVertices(origin)))
  }

  /**
   * Returns the number of hexgrid cells which fit in a rect of the given
   * size.
   */
  sizeForRect (width, height) {
    const cols = Math.floor(width / (2 * this.r)) - 1
    const rows = Math.floor(height / (this.radius + this.h)) - 1

    return [cols, rows]
  }
}
