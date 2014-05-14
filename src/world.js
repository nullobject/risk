var _          = require('lodash');
var core       = require('./core');
var d3         = require('d3');
var Country    = require('./country');
var Hexgrid    = require('./hexgrid');
var Polygon    = require('./polygon');
var PolygonSet = require('./polygon_set');

var RADIUS = 8, // Hexgrid radius.

    // The number of "seed" points to apply to the Voronoi function. More seeds
    // will result in more countries.
    SEEDS = 20,

    // The number of Lloyd relaxations to apply to the Voronoi regions. More
    // relaxations will result in countries more uniform in shape and size.
    RELAXATIONS = 2;

// Calculates the Voronoi regions for a set of points using a given Voronoi
// function.
function calculateRegions(voronoi, points) {
  // Calculate and relax the Voronoi regions for the points.
  var regions = relaxRegions(voronoi, voronoi(points), RELAXATIONS);

  regions.forEach(function(region) {
    region.neighbours = calculateNeighbouringRegions(regions, region);
  });

  return regions;
}

// Calculates the regions neighbouring a given region.
function calculateNeighbouringRegions(regions, region) {
  return region.cell.edges
    .map(function(edge) { return edge.edge; })
    .filter(function(edge) { return edge.l && edge.r; })
    .map(function(edge) {
      var i = (edge.l === region.cell.site ? edge.r.i : edge.l.i);
      return regions[i];
    });
}

// Applies a given number of Lloyd relaxations to a set of regions using a
// Voronoi function. http://en.wikipedia.org/wiki/Lloyd's_algorithm
function relaxRegions(voronoi, regions, relaxations) {
  return _.range(relaxations - 1).reduce(function(regions, i) {
    var points = regions.map(function(region) {
      return Polygon(region).centroid;
    });

    return voronoi(points);
  }, regions);
}

// Merge the hexagons inside the Voronoi regions into countries.
function calculateCountries(hexagons, regions, links) {
  var countries = regions.map(function(region) {
    // Find all hexagons inside the Voronoi region.
    var polygonSet = new PolygonSet(hexagons.filter(function(hexagon) {
      return Polygon(region).containsPoint(hexagon.centroid);
    }));

    // Merge the hexagons into a country.
    var vertices = polygonSet.merge()[0];

    // Create a new country.
    var country = new Country(vertices);
    country.region = region;
    return country;
  });

  countries.forEach(function(country) {
    country.calculateNeighbouringCountries(countries);
  });

  return countries;
}

function World(width, height) {
  // Create a hexgrid.
  var hexgrid = new Hexgrid(width, height, RADIUS);

  // Create a Voronoi function.
  var voronoi = d3.geom.voronoi().clipExtent([[0, 0], [width, height]]);

  // Generate a number of random "seed" points within the clipping region.
  var points = d3.range(SEEDS).map(function(d) {
    return [Math.random() * width, Math.random() * height];
  });

  this.hexagons = hexgrid.hexagons;
  this.regions = calculateRegions(voronoi, points);
  this.countries = calculateCountries(this.hexagons, this.regions);
}

module.exports = World;
