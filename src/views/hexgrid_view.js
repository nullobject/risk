import React from 'react'
import styles from '../../assets/stylesheets/styles.scss'

// Tile size.
const TILE_COLS = 3
const TILE_ROWS = 3

export default ({ hexgrid, height, width }) => {
  // Calculate the dimensions of the tile.
  const tileWidth = hexgrid.width * 2
  const tileHeight = hexgrid.height * 2

  return (
    <g className={styles.hexgrid}>
      <defs>
        <pattern id='tile' width={tileWidth} height={tileHeight} patternUnits='userSpaceOnUse'>
          {renderHexgrid(hexgrid)}
        </pattern>
      </defs>
      <rect width={width} height={height} fill='url(#tile)' />
    </g>
  )
}

function renderHexgrid (hexgrid) {
  const hexagons = hexgrid.build([TILE_COLS, TILE_ROWS], [-0.5, -0.5])
  return hexagons.map((polygon, index) => <polygon key={index} points={polygon} />)
}
