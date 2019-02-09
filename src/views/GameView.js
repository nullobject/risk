import React from 'react'

import ControlsView from './ControlsView'
import HexgridView from './HexgridView'
import PlayersView from './PlayersView'
import WorldView from './WorldView'
import styles from '../../assets/stylesheets/styles.scss'

export default ({ bus, game, muted }) =>
  <div className={styles.game}>
    <header>
      <PlayersView game={game} />
      <nav>
        <a href='#' onClick={() => bus.next('pause')}><span className={styles['icon-help']} /></a>
        <a href='#' onClick={() => bus.next('mute')}><span className={muted ? styles['icon-bell-slash'] : styles['icon-bell']} /></a>
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
