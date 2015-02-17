/**
 * This module defines operations on Voronoi diagrams.
 *
 * @module
 */

import F from 'fkit';
import Point from './geom/point';
import Polygon from './geom/polygon';
import Voronoi from '../lib/voronoi';

/**
 * Returns a Voronoi tessellation function for the given `width` and
 * `height`.
 */
export function tessellationFunction(width, height) {
  let voronoi = new Voronoi(),
      box     = {xl:0, xr:width, yt:0, yb:height};

  return points => {
    let diagram = voronoi.compute(points, box);
    diagram.recycle = () => voronoi.recycle(diagram);
    return diagram;
  };
}

/**
 * Returns the polygon for a given `cell`.
 */
export function polygonForCell(cell) {
  return F.compose(
    vertices => new Polygon(vertices),
    verticesForCell
  )(cell);
}

/**
 * Returns the vertices for a given cell.
 */
export function verticesForCell(cell) {
  return cell.halfedges.map(halfedge => new Point(halfedge.getStartpoint()));
}

/**
 * Calculates the Voronoi diagram for a given set of sites using a
 * tessellation function `t`. A number of Lloyd `relaxations` will also be
 * applied to the resulting diagram.
 *
 * See http://en.wikipedia.org/wiki/Lloyd's_algorithm
 */
export function calculateDiagram(t, sites, relaxations) {
  // Calculate the initial Voronoi diagram.
  let diagram = t(sites);

  // Apply a number of relaxations to the Voronoi diagram.
  return F.range(0, relaxations).reduce(diagram => {
    // Calculate the new sites from the centroids of the cells.
    let sites = diagram.cells.map(cell => polygonForCell(cell).centroid());

    // Recycle the diagram before computing it again.
    diagram.recycle();

    // Return a new Voronoi diagram.
    return t(sites);
  }, diagram);
}
