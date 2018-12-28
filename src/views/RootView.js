import 'normalize.css'
import React from 'react'

import GameOverView from './GameOverView'
import GameView from './GameView'
import HelpView from './HelpView'

export default ({ bus, state: { game, muted } }) =>
  <React.Fragment>
    <GameView bus={bus} game={game} muted={muted} />
    {game.paused ? <HelpView bus={bus} /> : null}
    {game.over ? <GameOverView bus={bus} win={game.win} /> : null}
  </React.Fragment>
