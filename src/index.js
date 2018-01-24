import * as WorldBuilder from './world_builder'
import Game from './game'
import Player from './player'
import React from 'react'
import ReactDOM from 'react-dom'
import RootComponent from './components/root_component'
import log from './log'
import nanobus from 'nanobus'
import nextMove from './ai'
import {Signal, merge} from 'bulb'
import {drop, equal, get, range} from 'fkit'

/**
 * The number of milliseconds between clock ticks.
 */
const CLOCK_INTERVAL = 100

/**
 * The number of players in the game.
 */
const PLAYERS = 5

/**
 * The number of human players in the game.
 */
const HUMANS = 1

/**
 * The dimensions.
 */
const WIDTH = 800
const HEIGHT = 600

const root = document.getElementById('root')

// Create the players.
const players = range(0, PLAYERS).map(id => new Player(id))

// Create the world.
const world = WorldBuilder.build(WIDTH, HEIGHT)

// Create the game state.
const game = new Game(players, world)

// Create the bus signal.
const bus = nanobus()
const inputSignal = fromBus(bus)

// Create the clock signal.
const clockSignal = Signal.periodic(CLOCK_INTERVAL)

// The game signal scans the game state transformer function over events on the
// input signal.
const gameSignal = inputSignal.scan(transformGameState, game)

// Map player IDs to AI signals.
const aiSignal = merge(drop(HUMANS, game.players).map(playerAI))

const subscriptions = [
  // Emit events from the AI signal on the bus.
  aiSignal.subscribe(move => bus.emit(move.type, move)),

  // Render the UI whenever the game property changes.
  gameSignal.subscribe(game => ReactDOM.render(<RootComponent game={game} bus={bus} />, root))
]

if (module.hot) {
  module.hot.dispose(() => {
    log.info('Unsubscribing...')
    subscriptions.forEach(s => s.unsubscribe())
  })
}

/**
 * Creates a new signal from a bus.
 *
 * @param bus A bus.
 * @returns A new signal.
 */
function fromBus (bus) {
  return new Signal(emit => {
    // Emit a value with the event type and data combined.
    const handler = (type, data) => emit.next({...data, type})

    bus.addListener('*', handler)
    return () => bus.removeListener('*', handler)
  })
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
    default:
      return game
  }
}

/*
 * The player AI stream emits the moves calculated for a player.
 *
 * @param player A player.
 * @returns A new signal.
 */
function playerAI (player) {
  const worldSignal = gameSignal.map(get('world'))

  return playerClock(player)
    .sample(worldSignal)
    .concatMap(nextMove(player))
}

/*
 * Returns a clock signal that only emits events when a player is current.
 *
 * @param player A player.
 * @returns A new signal.
 */
function playerClock (player) {
  const currentPlayerSignal = gameSignal.map(get('currentPlayer'))
  return clockSignal.sample(currentPlayerSignal).filter(equal(player))
}
