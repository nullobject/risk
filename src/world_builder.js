'use strict';

var Country = require('./country'),
    Hexgrid = require('./geom/hexgrid'),
    Point   = require('./geom/point'),
    Polygon = require('./geom/polygon'),
    Voronoi = require('../lib/voronoi'),
    World   = require('./world'),
    core    = require('./core'),
    fn      = require('fn.js');

// Hexgrid cell size.
var CELL_SIZE = 8;

// The number of "seed" sites to apply to the Voronoi function. More seeds
// will result in more countries.
var SEEDS = 30;

// The number of Lloyd relaxations to apply to the Voronoi cells. More
// relaxations will result in countries more uniform in shape and size.
var RELAXATIONS = 2;

// The number of pixels to offset the country polygons. This allows them to be
// rendered with fat borders.
var COUNTRY_POLYGON_OFFSET = -2;

// Returns the vertices for a given cell.
function verticesForCell(cell) {
  return cell.halfedges.map(function(halfedge) {
    return Point(halfedge.getStartpoint());
  });
}

// Returns the polygon for a given cell.
var polygonForCell = fn.compose(Polygon, verticesForCell);

// Calculates the Voronoi diagram for a given set of sites using a tessellation
// function. A number of Lloyd relaxations will also be applied to the
// resulting diagram.
//
// See http://en.wikipedia.org/wiki/Lloyd's_algorithm
function calculateDiagram(t, sites, relaxations) {
  // Calculate the initial Voronoi diagram.
  var diagram = t(sites);

  // Apply a number of relaxations to the Voronoi diagram.
  return core.range(relaxations).reduce(function(diagram) {
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

// Merges the given set of hexagons inside the Voronoi cells into countries.
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

    // Return a new country.
    return new Country(cell.site.voronoiId, neighbourIds, polygon.offset(COUNTRY_POLYGON_OFFSET));
  });
}

// Returns the cells neighbouring a given cell.
function neighbouringCells(cell, diagram) {
  return cell.getNeighborIds().map(function(id) {
    return diagram.cells[id];
  });
}

// Returns a new world with the given width and height.
module.exports = function(width, height) {
  var hexgrid  = Hexgrid(CELL_SIZE),
      size     = hexgrid.sizeForRect(width, height),
      hexagons = hexgrid.build(size, [1.0, 0.5]);

  // Create a Voronoi tessellation function.
  var voronoi = new Voronoi();
  var box = {xl:0, xr:width, yt:0, yb:height};
  var t = function(points) {
    var diagram = voronoi.compute(points, box);
    diagram.recycle = function() { voronoi.recycle(diagram); };
    return diagram;
  };

  // Generate a set of random "seed" sites within the clipping region.
  var sites = core.range(SEEDS).map(function() {
    return Point(core.randomFloat(0, width), core.randomFloat(0, height));
  });

  // Calculate the Voronoi diagram.
  var diagram = calculateDiagram(t, sites, RELAXATIONS);

  // Calculate the countries from the Voronoi diagram.
  var countries = calculateCountries(hexagons, diagram);

  // Calculate the Voronoi cells for debugging.
  var cells = diagram.cells.map(verticesForCell);

  // Return a new world.
  return new World(width, height, hexgrid, countries, cells);
};
