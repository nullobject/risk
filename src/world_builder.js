'use strict';

var core      = require('./core'),
    voronoi   = require('./voronoi'),
    Country   = require('./country'),
    F         = require('fkit'),
    Hexgrid   = require('./geom/hexgrid'),
    Immutable = require('immutable'),
    Point     = require('./geom/point'),
    Polygon   = require('./geom/polygon'),
    World     = require('./world');

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
 * Calculates the slot polygons given a country polygon and a list of the inner
 * hexagons.
 */
function calculateSlotPolygons(polygon, hexagons) {
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
var calculateCountries = F.curry(function(hexagons, diagram) {
  return diagram.cells.map(function(cell) {
    // Find the hexagons inside the cell.
    var countryHexagons = hexagons.filter(function(hexagon) {
      return voronoi.polygonForCell(cell).containsPoint(hexagon.centroid());
    });

    // Merge the hexagons into a larger polygon.
    var countryPolygon = Polygon.merge(countryHexagons);

    // Calculate the neighbouring cells.
    var neighbours = voronoi.neighbouringCells(cell, diagram);

    // Calculate the neighbour IDs.
    var neighbourIds = neighbours.map(function(neighbour) {
      return neighbour.site.voronoiId;
    });

    // Calculate the slots for the country.
    var slots = calculateSlotPolygons(countryPolygon, countryHexagons);

    // Return a new country.
    return new Country(
      cell.site.voronoiId,
      countryHexagons.length,
      neighbourIds,
      countryPolygon.offset(-COUNTRY_POLYGON_INSET),
      slots
    );
  });
});

/**
 * Prunes countries that are too small/big.
 */
function pruneCountriesBySize(countries) {
  // Filter countries by size.
  countries = countries.filter(function(country) {
    return core.between(country.size, MIN_COUNTRY_SIZE, MAX_COUNTRY_SIZE);
  });

  // Recalculate neighbours.
  countries = countries.map(function(country) {
    return country.recalculateNeighbours(countries);
  });

  return countries;
}

/**
 * Calculates islands of connected countries using a depth-first travsersal.
 */
function calculateIslands(countries) {
  var countriesMap = core.idMap(countries),
      countriesSet = Immutable.Set(countries),
      islandsSet   = Immutable.Set();

  return calculateIslands_(countriesSet, islandsSet);

  function calculateIslands_(remainingCountriesSet, islandsSet) {
    if (remainingCountriesSet.size > 0) {
      var nodes = function(country) {
        return country.neighbourIds.map(function(id) { return countriesMap.get(id); });
      };

      var island = core.traverse(remainingCountriesSet.first(), nodes);

      // Add the island to the islands set.
      islandsSet = islandsSet.add(island);

      // Remove the island from the remaining countries set.
      remainingCountriesSet = remainingCountriesSet.subtract(island);

      // Recurse with the remaining countries set.
      islandsSet = calculateIslands_(remainingCountriesSet, islandsSet);
    }

    return islandsSet;
  }
}

/**
 * Finds the largest island.
 */
function findLargestIsland(islands) {
  return islands.max(function(a, b) { return a.size > b.size; });
}

/**
 * Builds a new world with the given width and height.
 */
exports.build = function(width, height) {
  var hexgrid  = Hexgrid(CELL_SIZE),
      size     = hexgrid.sizeForRect(width, height),
      hexagons = hexgrid.build(size, [1.0, 0.5]);

  // Create a Voronoi tessellation function.
  var t = voronoi.tessellationFunction(width, height);

  // Generate a set of random "seed" sites within the clipping region.
  var sites = F.range(0, SEEDS).map(function() {
    return Point(F.randomFloat(0, width), F.randomFloat(0, height));
  });

  // Calculate the Voronoi diagram.
  var diagram = voronoi.calculateDiagram(t, sites, RELAXATIONS);

  // Calculate the countries.
  var countries = F.compose(
      findLargestIsland,
      calculateIslands,
      pruneCountriesBySize,
      calculateCountries(hexagons)
    )(diagram);

  // Calculate the Voronoi cells for debugging.
  var cells = diagram.cells.map(voronoi.verticesForCell);

  return new World(width, height, hexgrid, countries, cells);
};
