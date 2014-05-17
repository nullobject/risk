/** @jsx React.DOM */

var React = require('react');

function polygon(d) {
  return 'M' + d.join('L') + 'Z';
}

module.exports = React.createClass({
  render: function() {
    var paths = this.props.paths.map(function(path, index) {
      return <path key={index} d={polygon(path)} />;
    });

    return <g className={this.props.className}>{paths}</g>;
  }
});
