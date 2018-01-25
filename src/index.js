import 'normalize.css'
import * as WorldBuilder from './world_builder'
import Game from './game'
import Player from './player'
import React from 'react'
import ReactDOM from 'react-dom'
import RootView from './views/root_view'
import log from './log'
import nanobus from 'nanobus'
import nextMove from './ai'
import {Signal} from 'bulb'
import {fromBus} from './core'
import {range} from 'fkit'

/**
 * The number of milliseconds between clock ticks.
 */
const CLOCK_INTERVAL = 100

/**
 * The number of players in the game.
 */
const PLAYERS = 5

/**
 * The dimensions.
 */
const WIDTH = 600
const HEIGHT = 600

const root = document.getElementById('root')

// Create the players. The first player is a human player, the rest are AI
// players.
const players = range(0, PLAYERS).map(id => new Player(id, id === 0))

// Create the game state.
const game = buildGame(players)

// Create the bus signal.
const bus = nanobus()
const inputSignal = fromBus(bus)

// Create the clock signal.
const clockSignal = Signal.periodic(CLOCK_INTERVAL)

// The game signal scans the game state transformer function over events on the
// input signal.
const gameSignal = inputSignal.scan(transformGameState, game)

// The player AI stream emits the moves calculated for the current player.
const aiSignal = clockSignal
  .sample(gameSignal)
  .filter(game => !(game.over || game.currentPlayer.human))
  .concatMap(game => nextMove(game.currentPlayer, game.world))

const subscriptions = [
  // Emit events from the AI signal on the bus.
  aiSignal.subscribe(move => bus.emit(move.type, move)),

  // Render the UI whenever the game property changes.
  gameSignal.subscribe(game => ReactDOM.render(<RootView game={game} bus={bus} />, root))
]

if (module.hot) {
  module.hot.dispose(() => {
    log.info('Unsubscribing...')
    subscriptions.forEach(s => s.unsubscribe())
  })
}

function buildGame (players) {
  const world = WorldBuilder.build(WIDTH, HEIGHT)
  return new Game(players, world)
}

/**
 * Applies the event to yield a new game state.
 *
 * @param game A game.
 * @param event An event.
 * @returns A new game.
 */
function transformGameState (game, event) {
  switch (event.type) {
    case 'end-turn':
      return game.endTurn()
    case 'select-country':
      return game.selectCountry(event.country)
    case 'restart':
      return buildGame(game.players)
    default:
      return game
  }
}
