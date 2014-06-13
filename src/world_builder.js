'use strict';

var Country = require('./country'),
    Hexgrid = require('./geom/hexgrid'),
    Point   = require('./geom/point'),
    Polygon = require('./geom/polygon'),
    Voronoi = require('../lib/voronoi'),
    World   = require('./world'),
    _       = require('lodash');

// Hexgrid radius.
var RADIUS = 8;

// The number of "seed" sites to apply to the Voronoi function. More seeds
// will result in more countries.
var SEEDS = 20;

// The number of Lloyd relaxations to apply to the Voronoi cells. More
// relaxations will result in countries more uniform in shape and size.
var RELAXATIONS = 2;

// The number of pixels to offset the country polygons. This allows them to be
// rendered with fat borders.
var COUNTRY_POLYGON_OFFSET = -2;

function cellVertices(cell) {
  return cell.halfedges.map(function(halfedge) {
    return Point(halfedge.getStartpoint());
  });
}

// Returns the polygon for a given cell.
function cellPolygon(cell) {
  return Polygon(cellVertices(cell));
}

// Calculates the Voronoi diagram for a given set of sites using a tessellation
// function. A number of Lloyd relaxations will also be applied to the
// resulting diagram. http://en.wikipedia.org/wiki/Lloyd's_algorithm
function calculateDiagram(t, sites, relaxations) {
  // Calculate the initial Voronoi diagram.
  var diagram = t(sites);

  // Apply a number of relaxations to the Voronoi diagram.
  return _.range(relaxations).reduce(function(diagram) {
    // Calculate the new sites from the centroids of the cells.
    var sites = diagram.cells.map(function(cell) {
      return cellPolygon(cell).centroid();
    });

    // Recycle the diagram before computing it again.
    diagram.recycle();

    // Return a new Voronoi diagram.
    return t(sites);
  }, diagram);
}

// Merges the given set of hexagons inside the Voronoi cells into countries.
function calculateCountries(hexagons, diagram) {
  var countries = diagram.cells.reduce(function(countries, cell) {
    // Find the hexagons inside the cell.
    var innerHexagons = hexagons.filter(function(hexagon) {
      return cellPolygon(cell).containsPoint(hexagon.centroid());
    });

    // Merge the hexagons into a larger polygon.
    var polygon = Polygon.merge(innerHexagons);

    // Create a new country.
    countries[cell.site.voronoiId] = new Country(polygon.offset(COUNTRY_POLYGON_OFFSET));

    return countries;
  }, {});

  return _.map(countries, function(country, id) {
    var cell = diagram.cells[id];
    var neighbours = neighbouringCells(cell, diagram);

    // Set the country ID.
    country.id = id;

    // Set the country neighbours.
    country.neighbours = neighbours.map(function(neighbour) {
      return countries[neighbour.site.voronoiId];
    });

    return country;
  });
}

// Returns the cells neighbouring a given cell.
function neighbouringCells(cell, diagram) {
  return cell.getNeighborIds().map(function(id) {
    return diagram.cells[id];
  });
}

module.exports = {
  build: function(width, height, players) {
    // Create a hexgrid.
    var hexgrid = new Hexgrid(width, height, RADIUS);

    // Create a Voronoi tessellation function.
    var voronoi = new Voronoi();
    var box = {xl:0, xr:width, yt:0, yb:height};
    var t = function(points) {
      var diagram = voronoi.compute(points, box);
      diagram.recycle = function() { voronoi.recycle(diagram); };
      return diagram;
    };

    // Generate a set of random "seed" sites within the clipping region.
    var sites = _.range(SEEDS).map(function(d) {
      return Point(_.random(width, true), _.random(height, true));
    });

    // Calculate the Voronoi diagram.
    var diagram = calculateDiagram(t, sites, RELAXATIONS);

    // Calculate the countries from the Voronoi diagram.
    var countries = calculateCountries(hexgrid.hexagons, diagram);

    // Assign each player to a random country.
    _.sample(countries, players.length).forEach(function(country, index) {
      country.player = players[index];
    });

    // Calculate the Voronoi cells for debugging.
    var cells = diagram.cells.map(cellVertices);

    // Return a new world.
    return new World(hexgrid.hexagons, countries, cells);
  }
};
