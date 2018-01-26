import GameView from './game_view'
import GameOverView from './game_over_view'
import React from 'react'

export default class RootView extends React.PureComponent {
  render () {
    const bus = this.props.bus
    const game = this.props.game

    return (
      <React.Fragment>
        <GameView bus={bus} game={game} />
        {game.over ? <GameOverView bus={bus} /> : null}
      </React.Fragment>
    )
  }
}
