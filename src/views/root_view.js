import 'normalize.css'
import GameView from './game_view'
import GameOverView from './game_over_view'
import HelpView from './help_view'
import React from 'react'

export default ({bus, state: {game, muted}}) =>
  <React.Fragment>
    <GameView bus={bus} game={game} muted={muted} />
    {game.paused ? <HelpView bus={bus} /> : null}
    {game.over ? <GameOverView bus={bus} win={game.win} /> : null}
  </React.Fragment>
