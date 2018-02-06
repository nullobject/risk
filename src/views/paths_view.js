import React from 'react'

export default ({className, paths}) =>
  <g className={className}>
    {paths.map((path, index) => <path key={index} d={polygon(path)} />)}
  </g>

function polygon (d) { return 'M' + d.join('L') + 'Z' }
