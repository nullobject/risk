/** @jsx React.DOM */

'use strict';

var React = require('react'),
    core  = require('../core');

// Tile size.
var TILE_COLS = 3,
    TILE_ROWS = 3;

module.exports = React.createClass({
  displayName: 'HexgridComponent',

  shouldComponentUpdate: function(nextProps, nextState) {
    // Don't ever update the component.
    return false;
  },

  render: function() {
    var hexgrid  = this.props.hexgrid,
        hexagons = hexgrid.build([TILE_COLS, TILE_ROWS], [-0.5, -0.5]);

  // Calculate the dimensions of the tile.
  var width  = hexgrid.width * 2,
      height = hexgrid.height * 2;

    var polygons = hexagons.map(function(polygon, index) {
      return (
        /* jshint ignore:start */
        <polygon key={index} points={polygon} />
        /* jshint ignore:end */
      );
    });

    core.log('HexgridComponent#render');

    return (
      /* jshint ignore:start */
      <g className={this.props.className}>
        <defs>
          <pattern id="tile" width={width} height={height} patternUnits="userSpaceOnUse">
            {polygons}
          </pattern>
        </defs>
        <rect width={this.props.width} height={this.props.height} fill="url(#tile)" />
      </g>
      /* jshint ignore:end */
    );
  }
});
