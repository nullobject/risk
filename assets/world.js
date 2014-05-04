var _ = require('lodash');
var core = require('./core')
var d3 = require('d3');
var Hexgrid = require('./hexgrid')
var PolygonSet = require('./polygon_set')

var RADIUS = 8, // Hexgrid Radius.
    PADDING = 0, // Hexgrid padding.

    // The number of "seed" points to apply to the Voronoi function. More seeds
    // will result in more cells.
    SEEDS = 10,

    // The number of Lloyd relaxations to apply to the Voronoi regions. More
    // relaxations will result in cells more uniform in shape and size.
    RELAXATIONS = 2;

// Ray-casting algorithm based on
// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
function pointInPolygon(point, vs) {
  var x = point[0],
      y = point[1],
      inside = false;

  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];

    var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

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
      return d3.geom.polygon(region).centroid();
    });

    return voronoi(points);
  }, regions);
}

// Merge the hexagons inside the Voronoi regions into cells.
function calculateCells(hexagons, regions) {
  return _.flatten(regions.map(function(region) {
    // Find all hexagons inside the Voronoi region.
    var polygonSet = new PolygonSet(hexagons.filter(function(hexagon) {
      return pointInPolygon(hexagon.centroid, region);
    }));

    // Merge the hexagons into a cell.
    return polygonSet.merge();
  }), true);
}

function World(width, height) {
  var r = RADIUS * Math.cos(core.degreesToRadians(30));
  var h = RADIUS * Math.sin(core.degreesToRadians(30));

  // Calculate the number of columns and rows.
  var cols = Math.floor(width / (2 * r)) - 1,
      rows = Math.floor(height / (RADIUS + h)) - 1;

  // Create a hexgrid.
  var hexgrid = new Hexgrid(cols, rows, RADIUS, PADDING);

  // Create a Voronoi function.
  var voronoi = d3.geom.voronoi().clipExtent([[0, 0], [width, height]]);

  // Generate a number of random "seed" points within the clipping region.
  var points = d3.range(SEEDS).map(function(d) {
    return [Math.random() * width, Math.random() * height];
  });

  this.hexagons = hexgrid.hexagons;
  this.regions  = calculateRegions(voronoi, points);
  this.cells    = calculateCells(this.hexagons, this.regions);

  // TODO: Link adjacent cells together.
  this.links = voronoi.links(this.regions.map(function(region) {
    return region.point;
  }));
}

module.exports = World;
