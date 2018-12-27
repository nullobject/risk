import React from 'react'

import ControlsView from './controls_view'
import HexgridView from './hexgrid_view'
import PlayersView from './players_view'
import WorldView from './world_view'
import styles from '../../assets/stylesheets/styles.scss'

export default ({ bus, game, muted }) =>
  <div className={styles.game}>
    <header>
      <PlayersView game={game} />
      <nav>
        <a href='#' onClick={() => bus.emit('pause')}><span className={styles['icon-help']} /></a>
        <a href='#' onClick={() => bus.emit('mute')}><span className={muted ? styles['icon-bell-slash'] : styles['icon-bell']} /></a>
      </nav>
    </header>

    <svg width={game.world.width} height={game.world.height}>
      <HexgridView width={game.world.width} height={game.world.height} hexgrid={game.world.hexgrid} />
      <WorldView bus={bus} game={game} />
    </svg>

    <footer>
      <ControlsView currentPlayer={game.currentPlayer} bus={bus} />
    </footer>
  </div>
