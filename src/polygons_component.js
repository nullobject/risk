/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
  render: function() {
    var polygons = this.props.polygons.map(function(polygon, index) {
      return <polygon key={index} points={polygon.toString()} />;
    });

    return <g className={this.props.className}>{polygons}</g>;
  }
});
