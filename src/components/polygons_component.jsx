/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'PolygonsComponent',

  propTypes: {
    polygons:  React.PropTypes.array.isRequired,
    className: React.PropTypes.string.isRequired
  },

  render: function() {
    var polygons = this.props.polygons.map(function(polygon, index) {
      return (
        /* jshint ignore:start */
        <polygon key={index} points={polygon} />
        /* jshint ignore:end */
      );
    });

    return (
      /* jshint ignore:start */
      <g className={this.props.className}>{polygons}</g>
      /* jshint ignore:end */
    );
  }
});
