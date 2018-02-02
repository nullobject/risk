import ControlsView from './controls_view'
import HexgridView from './hexgrid_view'
import PlayersView from './players_view'
import React from 'react'
import WorldView from './world_view'
import styles from '../../assets/stylesheets/styles.scss'

const GITHUB_URL = 'https://github.com/nullobject/risk'
const TWITTER_URL = 'https://twitter.com/intent/tweet?text=Wanna%20play%20some%20Risk%3F&url=https%3A%2F%2Frisk.joshbassett.info'

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
            <a href={TWITTER_URL} target='_blank'><span className={styles['icon-twitter']} /></a>
            <a href={GITHUB_URL} target='_blank'><span className={styles['icon-github']} /></a>
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
