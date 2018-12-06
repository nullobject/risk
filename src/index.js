import * as WorldBuilder from './world_builder'
import Game from './game'
import Player from './player'
import React from 'react'
import ReactDOM from 'react-dom'
import RootView from './views/root_view'
import log from './log'
import nanobus from 'nanobus'
import nextMove from './ai'
import { Signal } from 'bulb'
import { fromBus } from './core'
import { play } from './sound'
import { range, set } from 'fkit'

/**
 * The number of milliseconds between clock ticks.
 */
const CLOCK_INTERVAL = 250

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

// Create the initial state.
const initialState = {
  game: buildGame(players),
  muted: window.localStorage.getItem('muted') === 'true'
}

// Create the bus signal.
const bus = nanobus()
const inputSignal = fromBus(bus)

// Create the clock signal.
const clockSignal = Signal.periodic(CLOCK_INTERVAL)

// The state signal scans the game state transformer function over events on
// the input signal.
const stateSignal = inputSignal.scan(transformer, initialState)

// The player AI stream emits the moves calculated for the current player.
const aiSignal = clockSignal
  .sample(stateSignal)
  .filter(state => !(state.game.over || state.game.currentPlayer.human))
  .concatMap(state => nextMove(state.game.currentPlayer, state.game.world))

const subscriptions = [
  // Emit events from the AI signal on the bus.
  aiSignal.subscribe(move => bus.emit(move.type, move)),

  // Render the UI whenever the state changes.
  stateSignal.subscribe(state => ReactDOM.render(<RootView bus={bus} state={state} />, root))
]

if (module.hot) {
  module.hot.dispose(() => {
    log.info('Unsubscribing...')
    subscriptions.forEach(s => s.unsubscribe())
  })
}

/**
 * Builds a new game.
 *
 * @param players The players of the game.
 * @returns A new game.
 */
function buildGame (players) {
  const world = WorldBuilder.build(WIDTH, HEIGHT)
  return new Game(players, world)
}

/**
 * Applies an event to yield a new state.
 *
 * @param state The current state.
 * @param event An event.
 * @returns A new game.
 */
function transformer (state, event) {
  let { game, muted } = state

  if (event.type === 'end-turn') {
    game = game.endTurn()
  } else if (event.type === 'select-country') {
    const result = game.selectCountry(event.country)
    game = result.game
    if (!muted) { play(result.action) }
  } else if (event.type === 'pause') {
    game = set('paused', !game.paused, game)
  } else if (event.type === 'mute') {
    muted = !muted
    window.localStorage.setItem('muted', muted)
  } else if (event.type === 'restart') {
    game = buildGame(game.players)
  }

  if (!muted && game.win) {
    play('win')
  } else if (!muted && game.over) {
    play('lose')
  }

  return { ...state, game, muted }
}
