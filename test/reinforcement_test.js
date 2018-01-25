import * as reinforcement from '../src/reinforcement'
import Graph from '../src/graph'
import {assert} from 'chai'

describe('reinforcement', () => {
  const p = {}
  const q = {}

  const a = {player: p, availableSlots: 0}
  const b = {player: q, availableSlots: 2}
  const c = {player: q, availableSlots: 1}
  const d = {player: q, availableSlots: 1}
  const e = {player: q, availableSlots: 0}
  const f = {player: q, availableSlots: 0}

  const values = {a, b, c, d, e, f}

  const edges = [
    ['a', 'b'], ['a', 'c'],
    ['b', 'a'], ['b', 'c'], ['b', 'd'], ['b', 'e'],
    ['c', 'a'], ['c', 'b'], ['c', 'e'], ['c', 'f'],
    ['d', 'b'], ['d', 'e'],
    ['e', 'b'], ['e', 'c'], ['e', 'd'], ['e', 'f'],
    ['f', 'c'], ['f', 'e']
  ]

  const graph = new Graph(values, edges)

  describe('.depthIndex', () => {
    it('returns the depth index for the player subgraphs', () => {
      const subgraphs = graph
        .filter(country => country.player === q)
        .connectedComponents()

      assert.deepEqual(reinforcement.depthIndex(graph, subgraphs), [['b', 'c'], ['f', 'd', 'e']])
    })
  })

  describe('.reinforcementMap', () => {
    it('returns the reinforcement map for the player countries', () => {
      const subgraphs = graph
        .filter(country => country.player === q)
        .connectedComponents()
      const depthIndex = [['b', 'c'], ['f', 'd', 'e']]
      assert.deepEqual(reinforcement.reinforcementMap(graph, subgraphs, depthIndex), {'b': 2, 'c': 1, 'd': 1, 'e': 0, 'f': 0})
    })
  })
})
