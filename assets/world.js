var _ = require('lodash');
var core = require('./core')
var d3 = require('d3');
var Hexgrid = require('./hexgrid')
var PolygonSet = require('./polygon_set')

var RADIUS = 8, PADDING = 0;

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

// Calculates the Voronoi regions.
function calculateRegions(width, height) {
  var points = d3.range(25).map(function(d) {
    return [Math.random() * width, Math.random() * height];
  });

  var voronoi = d3.geom.voronoi().clipExtent([[0, 0], [width, height]]);

  return applyVoronoi(voronoi, points, 5);
}

// Applies a Voronoi function to a given set of points, with a given number of Lloyd relaxations.
// http://en.wikipedia.org/wiki/Lloyd's_algorithm
function applyVoronoi(voronoi, points, relaxations) {
  return _.range(relaxations - 1).reduce(function(regions, i) {
    var points = regions.map(function(region) {
      return d3.geom.polygon(region).centroid();
    });

    return voronoi(points);
  }, voronoi(points));
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

  var cols = Math.floor(width / (2 * r)) - 1,
      rows = Math.floor(height / (RADIUS + h)) - 1;

  var hexgrid = new Hexgrid(cols, rows, RADIUS, PADDING);

  this.hexagons = hexgrid.hexagons;
  this.regions  = calculateRegions(width, height);
  this.cells    = calculateCells(this.hexagons, this.regions);

  // TODO: Link adjacent cells together.
  this.links = d3.geom.voronoi().links(this.regions.map(function(region) {
    return region.point;
  }));
}

module.exports = World;
