/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createClass({
  displayName: 'PolygonsComponent',

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
