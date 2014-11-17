'use strict';

var F       = require('fkit'),
    Point   = require('./geom/point'),
    Polygon = require('./geom/polygon'),
    Voronoi = require('../lib/voronoi');

var self;

/**
 * This module defines operations on Voronoi diagrams.
 *
 * @module
 */
self = module.exports = {
  /**
   * Returns a Voronoi tessellation function for the given `width` and
   * `height`.
   */
  tessellationFunction: function(width, height) {
    var voronoi = new Voronoi(),
        box = {xl:0, xr:width, yt:0, yb:height};

    return function(points) {
      var diagram = voronoi.compute(points, box);
      diagram.recycle = function() { voronoi.recycle(diagram); };
      return diagram;
    };
  },

  /**
   * Returns the polygon for a given `cell`.
   */
  polygonForCell: function(cell) {
    return F.compose(Polygon, self.verticesForCell)(cell);
  },

  /**
   * Returns the vertices for a given cell.
   */
  verticesForCell: function(cell) {
    return cell.halfedges.map(function(halfedge) {
      return Point(halfedge.getStartpoint());
    });
  },

  /**
   * Returns the cells neighbouring a given cell.
   */
  neighbouringCells: function(cell, diagram) {
    var cellWithId = F.flip(F.get, diagram.cells);
    return cell.getNeighborIds().map(cellWithId);
  },

  /**
   * Calculates the Voronoi diagram for a given set of sites using a
   * tessellation function `t`. A number of Lloyd `relaxations` will also be
   * applied to the resulting diagram.
   *
   * See http://en.wikipedia.org/wiki/Lloyd's_algorithm
   */
  calculateDiagram: function(t, sites, relaxations) {
    // Calculate the initial Voronoi diagram.
    var diagram = t(sites);

    // Apply a number of relaxations to the Voronoi diagram.
    return F.range(0, relaxations).reduce(function(diagram) {
      // Calculate the new sites from the centroids of the cells.
      var sites = diagram.cells.map(function(cell) {
        return self.polygonForCell(cell).centroid();
      });

      // Recycle the diagram before computing it again.
      diagram.recycle();

      // Return a new Voronoi diagram.
      return t(sites);
    }, diagram);
  },
};
