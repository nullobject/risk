import ControlsView from './controls_view'
import HexgridView from './hexgrid_view'
import PlayersView from './players_view'
import React from 'react'
import WorldView from './world_view'
import styles from '../stylesheets/styles.scss'

export default class RootView extends React.PureComponent {
  render () {
    const bus = this.props.bus
    const game = this.props.game

    return (
      <div className={styles.game}>
        <header>
          <PlayersView currentPlayer={game.currentPlayer} game={game} />
          <nav>
            <a href='#' onClick={() => bus.emit('pause')}><span className={styles['icon-help']} /></a>
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
    )
  }
}
