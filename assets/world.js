var _ = require('lodash');
var core = require('./core')
var d3 = require('d3');
var Hexgrid = require('./hexgrid')
var Polygon = require('./polygon')
var PolygonSet = require('./polygon_set')

var RADIUS = 8, // Hexgrid radius.

    // The number of "seed" points to apply to the Voronoi function. More seeds
    // will result in more cells.
    SEEDS = 20,

    // The number of Lloyd relaxations to apply to the Voronoi regions. More
    // relaxations will result in cells more uniform in shape and size.
    RELAXATIONS = 2;

// Calculates the Voronoi regions for a set of points using a given Voronoi
// function.
function calculateRegions(voronoi, points) {
  // Calculate the Voronoi regions for the points.
  var regions = voronoi(points);

  // Relax the Voronoi regions.
  return relaxRegions(voronoi, regions, RELAXATIONS);
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

// Merge the hexagons inside the Voronoi regions into cells.
function calculateCells(hexagons, regions, links) {
  return regions.map(function(region) {
    // Find all hexagons inside the Voronoi region.
    var polygonSet = new PolygonSet(hexagons.filter(function(hexagon) {
      return Polygon(region).containsPoint(hexagon.centroid);
    }));

    // Merge the hexagons into a cell.
    var cell = polygonSet.merge()[0];

    // Calculate nearby cells.
    cell.nearbyCells = links
      .filter(function(link) {
        return (link.target === region.point);
      })
      .map(function(link) {
        return _.find(regions, function(region) { return link.source === region.point });
      });

    return cell;
  });
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
  this.regions  = calculateRegions(voronoi, points);

  this.links = voronoi.links(this.regions.map(function(region) {
    return region.point;
  }));

  this.cells = calculateCells(this.hexagons, this.regions, this.links);
}

module.exports = World;
