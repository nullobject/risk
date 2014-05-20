/** @jsx React.DOM */

'use strict';

var React = require('react');

function polygon(d) {
  return 'M' + d.join('L') + 'Z';
}

module.exports = React.createClass({
  render: function() {
    var paths = this.props.paths.map(function(path, index) {
      /* jshint ignore:start */
      return <path key={index} d={polygon(path)} />;
      /* jshint ignore:end */
    });

    /* jshint ignore:start */
    return <g className={this.props.className}>{paths}</g>;
    /* jshint ignore:end */
  }
});
