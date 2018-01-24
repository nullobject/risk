import ControlsComponent from './controls_component'
import GameComponent from './game_component'
import HexgridComponent from './hexgrid_component'
import PlayersComponent from './players_component'
import React from 'react'
import log from '../log'
import styles from '../stylesheets/styles.scss'

export default class RootComponent extends React.PureComponent {
  render () {
    const bus = this.props.bus
    const game = this.props.game

    log.debug('RootComponent#render')

    return (
      <div className={styles.game}>
        <PlayersComponent currentPlayer={game.currentPlayer} game={game} />
        <svg width={game.world.width} height={game.world.height}>
          <HexgridComponent width={game.world.width} height={game.world.height} hexgrid={game.world.hexgrid} />
          <GameComponent bus={bus} game={game} />
          {this.renderGameOver(game)}
        </svg>
        <ControlsComponent currentPlayer={game.currentPlayer} bus={bus} />
      </div>
    )
  }

  renderGameOver (game) {
    return game.over ? (
      <g className={styles.gameOver}>
        <rect width='100%' height='100%' />
        <text x='50%' y='50%'>Game Over</text>
      </g>
    ) : null
  }
}
