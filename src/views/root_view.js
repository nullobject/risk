import ControlsView from './controls_view'
import GameView from './game_view'
import GameOverView from './game_over_view'
import HexgridView from './hexgrid_view'
import PlayersView from './players_view'
import React from 'react'
import log from '../log'

export default class RootView extends React.PureComponent {
  render () {
    const bus = this.props.bus
    const game = this.props.game

    log.debug('RootView#render')

    return (
      <React.Fragment>
        <PlayersView currentPlayer={game.currentPlayer} game={game} />
        <svg width={game.world.width} height={game.world.height}>
          <HexgridView width={game.world.width} height={game.world.height} hexgrid={game.world.hexgrid} />
          <GameView bus={bus} game={game} />
        </svg>
        <ControlsView currentPlayer={game.currentPlayer} bus={bus} />
        {game.over ? <GameOverView bus={bus} /> : null}
      </React.Fragment>
    )
  }
}
