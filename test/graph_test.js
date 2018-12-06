import * as F from 'fkit'
import Graph from '../src/graph'
import { assert } from 'chai'

describe('Graph', () => {
  const p = {}
  const q = {}
  const r = {}
  const s = {}

  const a = { player: p, score: 1 }
  const b = { player: q, score: 2 }
  const c = { player: q, score: 3 }
  const d = { player: q, score: 4 }
  const e = { player: q, score: 5 }
  const f = { player: q, score: 6 }
  const g = { player: r, score: 7 }
  const h = { player: r, score: 8 }
  const i = { player: r, score: 9 }
  const j = { player: r, score: 10 }
  const k = { player: r, score: 11 }
  const l = { player: s, score: 12 }

  const values = { a, b, c, d, e, f, g, h, i, j, k, l }

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
    it('returns the number of vertices', () => {
      assert.strictEqual(graph.size, 12)
    })
  })

  describe('#first', () => {
    it('returns the first vertex', () => {
      assert.strictEqual(graph.first(), a)
    })
  })

  describe('#last', () => {
    it('returns the last vertex', () => {
      assert.strictEqual(graph.last(), l)
    })
  })

  describe('#get', () => {
    it('returns the vertex for a given key', () => {
      assert.strictEqual(graph.get('a'), a)
      assert.strictEqual(graph.get('l'), l)
    })
  })

  describe('#merge', () => {
    it('merges the given vertices', () => {
      const m = { player: s, score: 13 }
      assert.strictEqual(graph.merge({ m }).last(), m)
    })
  })

  describe('#update', () => {
    it('updates the vertex for a given key', () => {
      const graph_ = graph.update('a', F.update('score', F.inc))
      assert.strictEqual(graph_.get('a').score, 2)
    })
  })

  describe('#keys', () => {
    it('returns the vertex keys', () => {
      assert.deepEqual(graph.keys(), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'])
    })
  })

  describe('#values', () => {
    it('returns the vertex values', () => {
      assert.deepEqual(graph.values(), Object.values(values))
    })
  })

  describe('#edges', () => {
    it('returns the edges', () => {
      assert.deepEqual(graph.edges(), edges)
    })
  })

  describe('#addVertex', () => {
    it('adds a vertex for a given key and value', () => {
      const m = { id: 'm', player: s, score: 13 }
      assert.deepEqual(graph.addVertex(m.id, m).last(), m)
    })
  })

  describe('#removeVertex', () => {
    it('removes the vertex for a given key', () => {
      assert.isUndefined(graph.removeVertex('l').get('l'))
    })
  })

  describe('#addEdge', () => {
    it('connects the vertices for the given keys', () => {
      assert.isFalse(graph.adjacent('c', 'd'))
      const graph_ = graph.addEdge('c', 'd')
      assert.isTrue(graph_.adjacent('c', 'd'))
    })
  })

  describe('#removeEdge', () => {
    it('disconnects the vertices for the given keys', () => {
      assert.isTrue(graph.adjacent('a', 'b'))
      const graph_ = graph.removeEdge('a', 'b')
      assert.isFalse(graph_.adjacent('a', 'b'))
    })
  })

  describe('#adjacent', () => {
    it('returns true for vertices that are adjacent', () => {
      assert.isTrue(graph.adjacent('a', 'b'))
      assert.isTrue(graph.adjacent('b', 'a'))
    })

    it('returns false for vertices that are not adjacent', () => {
      assert.isFalse(graph.adjacent('c', 'd'))
      assert.isFalse(graph.adjacent('d', 'c'))
    })
  })

  describe('#adjacentVertices', () => {
    it('returns keys of the vertices that are adjacent to the vertex', () => {
      assert.deepEqual(graph.adjacentVertices('a'), ['b', 'c'])
      assert.deepEqual(graph.adjacentVertices('b'), ['a', 'c', 'd', 'e'])
      assert.deepEqual(graph.adjacentVertices('c'), ['a', 'b', 'e', 'f'])
    })
  })

  describe('#adjacentValues', () => {
    it('returns keys of the vertices that are adjacent to the vertex', () => {
      assert.deepEqual(graph.adjacentValues('a'), [b, c])
      assert.deepEqual(graph.adjacentValues('b'), [a, c, d, e])
      assert.deepEqual(graph.adjacentValues('c'), [a, b, e, f])
    })
  })

  describe('#filter', () => {
    it('filters the values', () => {
      const result = graph.filter((value, key) => F.elem(key, 'abc'))
      assert.deepEqual(result.keys(), ['a', 'b', 'c'])
      assert.deepEqual(result.edges(), [
        ['a', 'b'], ['a', 'c'], ['b', 'a'], ['b', 'c'], ['c', 'a'], ['c', 'b']
      ])
    })
  })

  describe('#traverse', () => {
    it('returns a traverse of the graph from the starting vertex', () => {
      assert.deepEqual(graph.traverse('a'), ['a', 'b', 'c', 'd', 'e', 'f'])
      assert.deepEqual(graph.traverse('g'), ['g', 'h', 'j', 'i', 'k', 'l'])
    })
  })

  describe('#shortestPath', () => {
    it('returns the shortest path to a matching vertex', () => {
      assert.deepEqual(graph.shortestPath('a', 'a'), ['a'])
      assert.deepEqual(graph.shortestPath('a', 'b'), ['a', 'b'])
      assert.deepEqual(graph.shortestPath('f', 'a'), ['f', 'c', 'a'])
    })

    it('returns an empty path when no matching vertex is found', () => {
      assert.deepEqual(graph.shortestPath('a', 'z'), [])
    })
  })

  describe('#shortestPathBy', () => {
    const player = F.curry((p, a) => a.player === p)

    it('returns the shortest path to a matching vertex', () => {
      assert.deepEqual(graph.shortestPathBy(player(p), 'a'), ['a'])
      assert.deepEqual(graph.shortestPathBy(player(q), 'a'), ['a', 'b'])
      assert.deepEqual(graph.shortestPathBy(player(p), 'f'), ['f', 'c', 'a'])
    })

    it('returns an empty path when no matching vertex is found', () => {
      assert.deepEqual(graph.shortestPathBy(player(r), 'a'), [])
    })
  })

  describe('#connectedComponents', () => {
    it('returns the connected components of a graph', () => {
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
