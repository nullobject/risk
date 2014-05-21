/** @jsx React.DOM */

'use strict';

var React = require('react');

function polygon(d) {
  return 'M' + d.join('L') + 'Z';
}

module.exports = React.createClass({
  displayName: 'PathsComponent',

  render: function() {
    var paths = this.props.paths.map(function(path, index) {
      return (
        /* jshint ignore:start */
        <path key={index} d={polygon(path)} />
        /* jshint ignore:end */
      );
    });

    return (
      /* jshint ignore:start */
      <g className={this.props.className}>{paths}</g>
      /* jshint ignore:end */
    );
  }
});
