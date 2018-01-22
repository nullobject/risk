import * as core from './core'
import * as voronoi from './voronoi'
import Country from './country'
import Graph from './graph'
import Hexgrid from './geom/hexgrid'
import * as F from 'fkit'
import Point from './geom/point'
import Polygon from './geom/polygon'
import World from './world'

/**
 * Hexgrid cell size.
 */
const CELL_SIZE = 8

/**
 * The number of "seed" sites to apply to the Voronoi function. More seeds will
 * result in more countries.
 */
const SEEDS = 48

/**
 * The number of Lloyd relaxations to apply to the Voronoi cells. More
 * relaxations will result in countries more uniform in shape and size.
 */
const RELAXATIONS = 2

/**
 * The number of pixels to inset the country polygons. This allows them to be
 * rendered with fat borders.
 */
const COUNTRY_POLYGON_INSET = 2

/**
 * The number of pixels to inset the slot polygons.
 */
const SLOT_POLYGON_INSET = 2

/**
 * The minimum number of slots a country can have.
 */
const MIN_SLOTS = 7

/**
 * The maximum number of slots a country can have.
 */
const MAX_SLOTS = 9

/**
 * The minimum country size.
 */
const MIN_COUNTRY_SIZE = 48

/**
 * The maximum country size.
 */
const MAX_COUNTRY_SIZE = 128

/**
 * Calculates the slot polygons given a country polygon and a list of the inner
 * hexagons.
 */
function calculateSlotPolygons (polygon, hexagons) {
  // Calculate the number of slots in the country.
  const n = F.clamp(MIN_SLOTS, MAX_SLOTS, Math.sqrt(hexagons.length))

  // Calculate the hexagon in the centre of the polygon.
  const centreHexagon = F.head(F.sortBy(Polygon.distanceComparator(polygon), hexagons))

  // Calculate the `n` hexagons in centre of the polygon.
  const centreHexagons = F.take(n, F.sortBy(Polygon.distanceComparator(centreHexagon), hexagons))

  return centreHexagons.map(F.applyMethod('offset', -SLOT_POLYGON_INSET))
}

/**
 * Merges the given set of hexagons inside the Voronoi cells into countries.
 */
const calculateCountries = F.curry((hexagons, diagram) =>
  diagram.cells.map(cell => {
    // Find the hexagons inside the cell.
    const countryHexagons = hexagons.filter(hexagon =>
      voronoi.polygonForCell(cell).containsPoint(hexagon.centroid())
    )

    // Merge the hexagons into a larger polygon.
    const countryPolygon = Polygon.merge(countryHexagons)

    // Calculate the slots for the country.
    const slots = calculateSlotPolygons(countryPolygon, countryHexagons)

    // Return a new country.
    return new Country(
      cell.site.voronoiId.toString(),
      countryHexagons.length,
      countryPolygon.offset(-COUNTRY_POLYGON_INSET),
      slots
    )
  })
)

function calculateEdges (diagram) {
  // FIXME: FKit `concatMap` should handle arrays of strings properly.
  return F.concat(diagram.cells.map(cell => {
    const a = cell.site.voronoiId
    return cell.getNeighborIds().map(b => [a.toString(), b.toString()])
  }))
}

// Filters countries that are too small/big.
const byCountrySize = country => F.between(MIN_COUNTRY_SIZE, MAX_COUNTRY_SIZE, country.size)

/**
 * Builds a new world with the given width and height.
 */
export function build (width, height) {
  const hexgrid = new Hexgrid(CELL_SIZE)
  const size = hexgrid.sizeForRect(width, height)
  const hexagons = hexgrid.build(size, [1.0, 0.5])

  // Create a Voronoi tessellation function.
  const t = voronoi.tessellationFunction(width, height)

  // Generate a list of random "seed" sites within the clipping region.
  const sites = F.range(0, SEEDS).map(() =>
    new Point(F.randomFloat(0, width), F.randomFloat(0, height))
  )

  // Calculate the Voronoi diagram.
  const diagram = voronoi.calculateDiagram(t, sites, RELAXATIONS)

  // Calculate the countries.
  const countries = calculateCountries(hexagons, diagram)

  // Calculate the graph edges.
  const edges = calculateEdges(diagram)

  // Calculate the subgraphs.
  const subgraphs = new Graph(countries, edges)
    .filter(byCountrySize)
    .connectedComponents()

  // Choose the largest subgraph.
  const graph = F.maximumBy(core.bySize, subgraphs)

  // Calculate the Voronoi cells for debugging.
  const cells = diagram.cells.map(voronoi.verticesForCell)

  return new World(width, height, hexgrid, cells, graph)
}
