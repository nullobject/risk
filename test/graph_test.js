import * as F from 'fkit'
import Graph from '../src/graph'
import {assert} from 'chai'

describe('Graph', () => {
  const p = {}
  const q = {}
  const r = {}
  const s = {}

  const a = {id: 'a', player: p, score: 1}
  const b = {id: 'b', player: q, score: 2}
  const c = {id: 'c', player: q, score: 3}
  const d = {id: 'd', player: q, score: 4}
  const e = {id: 'e', player: q, score: 5}
  const f = {id: 'f', player: q, score: 6}
  const g = {id: 'g', player: r, score: 7}
  const h = {id: 'h', player: r, score: 8}
  const i = {id: 'i', player: r, score: 9}
  const j = {id: 'j', player: r, score: 10}
  const k = {id: 'k', player: r, score: 11}
  const l = {id: 'l', player: s, score: 12}

  const values = [a, b, c, d, e, f, g, h, i, j, k, l]

  const edges = [
    ['a', 'b'], ['a', 'c'],
    ['b', 'a'], ['b', 'c'], ['b', 'd'], ['b', 'e'],
    ['c', 'a'], ['c', 'b'], ['c', 'e'], ['c', 'f'],
    ['d', 'b'], ['d', 'e'],
    ['e', 'b'], ['e', 'c'], ['e', 'd'], ['e', 'f'],
    ['f', 'c'], ['f', 'e'],
    ['g', 'h'], ['g', 'j'],
    ['h', 'g'], ['h', 'i'], ['h', 'j'], ['h', 'k'],
    ['i', 'h'], ['i', 'k'],
    ['j', 'g'], ['j', 'h'], ['j', 'k'], ['j', 'l'],
    ['k', 'h'], ['k', 'i'], ['k', 'j'], ['k', 'l'],
    ['l', 'j'], ['l', 'k']
  ]

  const graph = new Graph(values, edges)

  describe('#size', () => {
    it('should return the number of vertices', () => {
      assert.strictEqual(graph.size, 12)
    })
  })

  describe('#first', () => {
    it('should return the first vertex', () => {
      assert.strictEqual(graph.first(), a)
    })
  })

  describe('#last', () => {
    it('should return the last vertex', () => {
      assert.strictEqual(graph.last(), l)
    })
  })

  describe('#get', () => {
    it('should return the vertex with the given key', () => {
      assert.strictEqual(graph.get('a'), a)
      assert.strictEqual(graph.get('l'), l)
    })
  })

  describe('#merge', () => {
    it('should merge the given vertices', () => {
      const m = {id: 'm', player: s, score: 13}
      assert.strictEqual(graph.merge([m]).last(), m)
    })
  })

  describe('#update', () => {
    it('should update the vertex with the given key', () => {
      const graph_ = graph.update('a', F.update('score', F.inc))
      assert.strictEqual(graph_.get('a').score, 2)
    })
  })

  describe('#keys', () => {
    it('should return the vertex keys', () => {
      assert.deepEqual(graph.keys(), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'])
    })
  })

  describe('#values', () => {
    it('should return the vertex values', () => {
      assert.deepEqual(graph.values(), values)
    })
  })

  describe('#edges', () => {
    it('should return the edges', () => {
      assert.deepEqual(graph.edges(), edges)
    })
  })

  describe('#addVertex', () => {
    it('should add a vertex with the given key and value', () => {
      const m = {id: 'm', player: s, score: 13}
      assert.deepEqual(graph.addVertex(m.id, m).last(), m)
    })
  })

  describe('#removeVertex', () => {
    it('should remove the vertex with the given key', () => {
      assert.isUndefined(graph.removeVertex('l').get('l'))
    })
  })

  describe('#addEdge', () => {
    it('should connect the vertices with the given keys', () => {
      assert.isFalse(graph.adjacent('c', 'd'))
      const graph_ = graph.addEdge('c', 'd')
      assert.isTrue(graph_.adjacent('c', 'd'))
    })
  })

  describe('#removeEdge', () => {
    it('should connect the vertices with the given keys', () => {
      assert.isTrue(graph.adjacent('a', 'b'))
      const graph_ = graph.removeEdge('a', 'b')
      assert.isFalse(graph_.adjacent('a', 'b'))
    })
  })

  describe('#adjacent', () => {
    it('should return true for vertices that are adjacent', () => {
      assert.isTrue(graph.adjacent('a', 'b'))
      assert.isTrue(graph.adjacent('b', 'a'))
    })

    it('should return false for vertices that are not adjacent', () => {
      assert.isFalse(graph.adjacent('c', 'd'))
      assert.isFalse(graph.adjacent('d', 'c'))
    })
  })

  describe('#adjacentVertices', () => {
    it('should return keys of the vertices that are adjacent to the vertex', () => {
      assert.deepEqual(graph.adjacentVertices('a'), ['b', 'c'])
      assert.deepEqual(graph.adjacentVertices('b'), ['a', 'c', 'd', 'e'])
      assert.deepEqual(graph.adjacentVertices('c'), ['a', 'b', 'e', 'f'])
    })
  })

  describe('#adjacentValues', () => {
    it('should return keys of the vertices that are adjacent to the vertex', () => {
      assert.deepEqual(graph.adjacentValues('a'), [b, c])
      assert.deepEqual(graph.adjacentValues('b'), [a, c, d, e])
      assert.deepEqual(graph.adjacentValues('c'), [a, b, e, f])
    })
  })

  describe('#filter', () => {
    it('should filter the values', () => {
      const result = graph.filter((value, key) => F.elem(key, 'abc'))
      assert.deepEqual(result.keys(), ['a', 'b', 'c'])
      assert.deepEqual(result.edges(), [
        ['a', 'b'], ['a', 'c'], ['b', 'a'], ['b', 'c'], ['c', 'a'], ['c', 'b']
      ])
    })
  })

  describe('#traverse', () => {
    it('should return a traverse of the graph from the starting vertex', () => {
      assert.deepEqual(graph.traverse('a'), ['a', 'b', 'c', 'd', 'e', 'f'])
      assert.deepEqual(graph.traverse('g'), ['g', 'h', 'j', 'i', 'k', 'l'])
    })
  })

  describe('#shortestPath', () => {
    it('should return the shortest path to a matching vertex', () => {
      assert.deepEqual(graph.shortestPath('a', 'a'), ['a'])
      assert.deepEqual(graph.shortestPath('a', 'b'), ['a', 'b'])
      assert.deepEqual(graph.shortestPath('f', 'a'), ['f', 'c', 'a'])
    })

    it('should return an empty path when no matching vertex is found', () => {
      assert.deepEqual(graph.shortestPath('a', 'z'), [])
    })
  })

  describe('#shortestPathBy', () => {
    const player = F.curry((p, a) => a.player === p)

    it('should return the shortest path to a matching vertex', () => {
      assert.deepEqual(graph.shortestPathBy(player(p), 'a'), ['a'])
      assert.deepEqual(graph.shortestPathBy(player(q), 'a'), ['a', 'b'])
      assert.deepEqual(graph.shortestPathBy(player(p), 'f'), ['f', 'c', 'a'])
    })

    it('should return an empty path when no matching vertex is found', () => {
      assert.deepEqual(graph.shortestPathBy(player(r), 'a'), [])
    })
  })

  describe('#connectedComponents', () => {
    it('should return the connected components of a graph', () => {
      const result = graph.connectedComponents()

      assert.strictEqual(result.length, 2)

      assert.deepEqual(result[0].keys(), ['a', 'b', 'c', 'd', 'e', 'f'])
      assert.deepEqual(result[0].edges(), [
        ['a', 'b'], ['a', 'c'],
        ['b', 'a'], ['b', 'c'], ['b', 'd'], ['b', 'e'],
        ['c', 'a'], ['c', 'b'], ['c', 'e'], ['c', 'f'],
        ['d', 'b'], ['d', 'e'],
        ['e', 'b'], ['e', 'c'], ['e', 'd'], ['e', 'f'],
        ['f', 'c'], ['f', 'e']
      ])

      assert.deepEqual(result[1].keys(), ['g', 'h', 'i', 'j', 'k', 'l'])
      assert.deepEqual(result[1].edges(), [
        ['g', 'h'], ['g', 'j'],
        ['h', 'g'], ['h', 'i'], ['h', 'j'], ['h', 'k'],
        ['i', 'h'], ['i', 'k'],
        ['j', 'g'], ['j', 'h'], ['j', 'k'], ['j', 'l'],
        ['k', 'h'], ['k', 'i'], ['k', 'j'], ['k', 'l'],
        ['l', 'j'], ['l', 'k']
      ])
    })
  })
})
