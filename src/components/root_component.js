import ControlsComponent from './controls_component'
import GameComponent from './game_component'
import GameOverView from './game_over_view'
import HexgridComponent from './hexgrid_component'
import PlayersComponent from './players_component'
import React from 'react'
import log from '../log'

export default class RootComponent extends React.PureComponent {
  render () {
    const bus = this.props.bus
    const game = this.props.game

    log.debug('RootComponent#render')

    return (
      <React.Fragment>
        <PlayersComponent currentPlayer={game.currentPlayer} game={game} />
        <svg width={game.world.width} height={game.world.height}>
          <HexgridComponent width={game.world.width} height={game.world.height} hexgrid={game.world.hexgrid} />
          <GameComponent bus={bus} game={game} />
        </svg>
        <ControlsComponent currentPlayer={game.currentPlayer} bus={bus} />
        {game.over ? <GameOverView bus={bus} /> : null}
      </React.Fragment>
    )
  }
}
