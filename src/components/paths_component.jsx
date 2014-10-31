'use strict';

var React = require('react');

function polygon(d) { return 'M' + d.join('L') + 'Z'; }

module.exports = React.createClass({
  displayName: 'PathsComponent',

  propTypes: {
    paths:     React.PropTypes.array.isRequired,
    className: React.PropTypes.string.isRequired
  },

  render: function() {
    return (
      /* jshint ignore:start */
      <g className={this.props.className}>{this.renderPaths(this.props.paths)}</g>
      /* jshint ignore:end */
    );
  },

  renderPaths: function(paths) {
    return paths.map(this.renderPath);
  },

  renderPath: function(path, index) {
    return (
      /* jshint ignore:start */
      <path key={index} d={polygon(path)} />
      /* jshint ignore:end */
    );
  },
});
