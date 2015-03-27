import React from 'react';

function polygon(d) { return 'M' + d.join('L') + 'Z'; }

export default class PathsComponent extends React.Component {
  render() {
    return (
      /* jshint ignore:start */
      <g className={this.props.className}>{this.renderPaths(this.props.paths)}</g>
      /* jshint ignore:end */
    );
  }

  renderPaths(paths) {
    return paths.map(this.renderPath);
  }

  renderPath(path, index) {
    return (
      /* jshint ignore:start */
      <path key={index} d={polygon(path)} />
      /* jshint ignore:end */
    );
  }
}

PathsComponent.propTypes = {
  paths:     React.PropTypes.array.isRequired,
  className: React.PropTypes.string.isRequired
};
