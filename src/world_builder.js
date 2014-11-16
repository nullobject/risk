'use strict';

var core    = require('./core'),
    Country = require('./country'),
    F       = require('fkit'),
    Hexgrid = require('./geom/hexgrid'),
    Point   = require('./geom/point'),
    Polygon = require('./geom/polygon'),
    Voronoi = require('../lib/voronoi'),
    World   = require('./world');

/**
 * Hexgrid cell size.
 */
var CELL_SIZE = 8;

/**
 * The number of "seed" sites to apply to the Voronoi function. More seeds will
 * result in more countries.
 */
var SEEDS = 48;

/**
 * The number of Lloyd relaxations to apply to the Voronoi cells. More
 * relaxations will result in countries more uniform in shape and size.
 */
var RELAXATIONS = 2;

/**
 * The number of pixels to inset the country polygons. This allows them to be
 * rendered with fat borders.
 */
var COUNTRY_POLYGON_INSET = 2;

/**
 * The number of pixels to inset the slot polygons.
 */
var SLOT_POLYGON_INSET = 2;

/**
 * The minimum number of slots a country can have.
 */
var MIN_SLOTS = 7;

/**
 * The maximum number of slots a country can have.
 */
var MAX_SLOTS = 9;

/**
 * The minimum country size.
 */
var MIN_COUNTRY_SIZE = 64;

/**
 * The maximum country size.
 */
var MAX_COUNTRY_SIZE = 128;

/**
 * Returns the vertices for a given cell.
 */
function verticesForCell(cell) {
  return cell.halfedges.map(function(halfedge) {
    return Point(halfedge.getStartpoint());
  });
}

/**
 * Returns the polygon for a given cell.
 */
var polygonForCell = F.compose(Polygon, verticesForCell);

/**
 * Calculates the Voronoi diagram for a given set of sites using a tessellation
 * function. A number of Lloyd relaxations will also be applied to the
 * resulting diagram.
 *
 * See http://en.wikipedia.org/wiki/Lloyd's_algorithm
 */
function calculateDiagram(t, sites, relaxations) {
  // Calculate the initial Voronoi diagram.
  var diagram = t(sites);

  // Apply a number of relaxations to the Voronoi diagram.
  return F.range(0, relaxations).reduce(function(diagram) {
    // Calculate the new sites from the centroids of the cells.
    var sites = diagram.cells.map(function(cell) {
      return polygonForCell(cell).centroid();
    });

    // Recycle the diagram before computing it again.
    diagram.recycle();

    // Return a new Voronoi diagram.
    return t(sites);
  }, diagram);
}

/**
 * Returns the cells neighbouring a given cell.
 */
function neighbouringCells(cell, diagram) {
  var cellWithId = F.flip(F.get, diagram.cells);
  return cell.getNeighborIds().map(cellWithId);
}

function calculateSlots(hexagons, polygon) {
  // Calculate the number of slots in the country.
  var n = core.clamp(Math.sqrt(hexagons.length), MIN_SLOTS, MAX_SLOTS);

  // Calculate the hexagon in the centre of the polygon.
  var centreHexagon = F.head(F.sortBy(Polygon.distanceComparator(polygon), hexagons));

  // Calculate the `n` hexagons in centre of the polygon.
  var centreHexagons = F.take(n, F.sortBy(Polygon.distanceComparator(centreHexagon), hexagons));

  return centreHexagons.map(F.applyMethod('offset', -SLOT_POLYGON_INSET));
}

/**
 * Merges the given set of hexagons inside the Voronoi cells into countries.
 */
function calculateCountries(hexagons, diagram) {
  return diagram.cells.map(function(cell) {
    // Find the hexagons inside the cell.
    var innerHexagons = hexagons.filter(function(hexagon) {
      return polygonForCell(cell).containsPoint(hexagon.centroid());
    });

    // Merge the hexagons into a larger polygon.
    var polygon = Polygon.merge(innerHexagons);

    // Calculate the neighbouring cells.
    var neighbours = neighbouringCells(cell, diagram);

    // Calculate the neighbour IDs.
    var neighbourIds = neighbours.map(function(neighbour) {
      return neighbour.site.voronoiId;
    });

    // Calculate the slots for the country.
    var slots = calculateSlots(innerHexagons, polygon);

    // Return a new country.
    return new Country(
      cell.site.voronoiId,
      innerHexagons.length,
      neighbourIds,
      polygon.offset(-COUNTRY_POLYGON_INSET),
      slots
    );
  });
}

/**
 * Returns a Voronoi tessellation function for the given width and height.
 */
function tessellationFunction(width, height) {
  var voronoi = new Voronoi(),
      box = {xl:0, xr:width, yt:0, yb:height};

  return function(points) {
    var diagram = voronoi.compute(points, box);
    diagram.recycle = function() { voronoi.recycle(diagram); };
    return diagram;
  };
}

/**
 * Builds a new world with the given width and height.
 *
 * TODO: Prune islands.
 */
exports.build = function(width, height) {
  var hexgrid  = Hexgrid(CELL_SIZE),
      size     = hexgrid.sizeForRect(width, height),
      hexagons = hexgrid.build(size, [1.0, 0.5]);

  // Create a Voronoi tessellation function.
  var t = tessellationFunction(width, height);

  // Generate a set of random "seed" sites within the clipping region.
  var sites = F.range(0, SEEDS).map(function() {
    return Point(F.randomFloat(0, width), F.randomFloat(0, height));
  });

  // Calculate the Voronoi diagram.
  var diagram = calculateDiagram(t, sites, RELAXATIONS);

  // Calculate the countries from the Voronoi diagram.
  var countries = calculateCountries(hexagons, diagram).filter(function(country) {
    return country.size >= MIN_COUNTRY_SIZE && country.size <= MAX_COUNTRY_SIZE;
  });

  // Calculate the Voronoi cells for debugging.
  var cells = diagram.cells.map(verticesForCell);

  return new World(width, height, hexgrid, countries, cells);
};
