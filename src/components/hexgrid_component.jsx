import * as core from '../core'
import React from 'react'
import styles from '../styles.scss'

// Tile size.
const TILE_COLS = 3,
  TILE_ROWS = 3

export default class HexgridComponent extends React.Component {
  shouldComponentUpdate (nextProps, nextState) {
    // Don't ever update the component.
    return false
  }

  render () {
    let hexgrid = this.props.hexgrid

    // Calculate the dimensions of the tile.
    let width = hexgrid.width * 2,
      height = hexgrid.height * 2

    core.log('HexgridComponent#render')

    return (
      /* jshint ignore:start */
      <g className={styles.hexgrid}>
        <defs>
          <pattern id='tile' width={width} height={height} patternUnits='userSpaceOnUse'>
            {this.renderHexgrid(hexgrid)}
          </pattern>
        </defs>
        <rect width={this.props.width} height={this.props.height} fill='url(#tile)' />
      </g>
      /* jshint ignore:end */
    )
  }

  renderHexgrid (hexgrid) {
    let hexagons = hexgrid.build([TILE_COLS, TILE_ROWS], [-0.5, -0.5])
    return hexagons.map(this.renderPolygon)
  }

  renderPolygon (polygon, index) {
    return (
      /* jshint ignore:start */
      <polygon key={index} points={polygon} />
      /* jshint ignore:end */
    )
  }
}
