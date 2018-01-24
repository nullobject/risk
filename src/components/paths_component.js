import React from 'react'

function polygon (d) { return 'M' + d.join('L') + 'Z' }

export default class PathsComponent extends React.PureComponent {
  render () {
    return (
      <g className={this.props.className}>{this.renderPaths(this.props.paths)}</g>
    )
  }

  renderPaths (paths) {
    return paths.map(this.renderPath)
  }

  renderPath (path, index) {
    return (
      <path key={index} d={polygon(path)} />
    )
  }
}
