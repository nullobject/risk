import * as F from 'fkit'

import Graph from './Graph'

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
      expect(graph.size).toEqual(12)
    })
  })

  describe('#first', () => {
    it('returns the first vertex', () => {
      expect(graph.first()).toEqual(a)
    })
  })

  describe('#last', () => {
    it('returns the last vertex', () => {
      expect(graph.last()).toEqual(l)
    })
  })

  describe('#get', () => {
    it('returns the vertex for a given key', () => {
      expect(graph.get('a')).toEqual(a)
      expect(graph.get('l')).toEqual(l)
    })
  })

  describe('#merge', () => {
    it('merges the given vertices', () => {
      const m = { player: s, score: 13 }
      expect(graph.merge({ m }).last()).toEqual(m)
    })
  })

  describe('#update', () => {
    it('updates the vertex for a given key', () => {
      const graph_ = graph.update('a', F.update('score', F.inc))
      expect(graph_.get('a').score).toEqual(2)
    })
  })

  describe('#keys', () => {
    it('returns the vertex keys', () => {
      expect(graph.keys()).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'])
    })
  })

  describe('#values', () => {
    it('returns the vertex values', () => {
      expect(graph.values()).toEqual(Object.values(values))
    })
  })

  describe('#edges', () => {
    it('returns the edges', () => {
      expect(graph.edges()).toEqual(edges)
    })
  })

  describe('#addVertex', () => {
    it('adds a vertex for a given key and value', () => {
      const m = { id: 'm', player: s, score: 13 }
      expect(graph.addVertex(m.id, m).last()).toEqual(m)
    })
  })

  describe('#removeVertex', () => {
    it('removes the vertex for a given key', () => {
      expect(graph.removeVertex('l').get('l')).toBeUndefined()
    })
  })

  describe('#addEdge', () => {
    it('connects the vertices for the given keys', () => {
      expect(graph.adjacent('c', 'd')).toBe(false)
      const graph_ = graph.addEdge('c', 'd')
      expect(graph_.adjacent('c', 'd')).toBe(true)
    })
  })

  describe('#removeEdge', () => {
    it('disconnects the vertices for the given keys', () => {
      expect(graph.adjacent('a', 'b')).toBe(true)
      const graph_ = graph.removeEdge('a', 'b')
      expect(graph_.adjacent('a', 'b')).toBe(false)
    })
  })

  describe('#adjacent', () => {
    it('returns true for vertices that are adjacent', () => {
      expect(graph.adjacent('a', 'b')).toBe(true)
      expect(graph.adjacent('b', 'a')).toBe(true)
    })

    it('returns false for vertices that are not adjacent', () => {
      expect(graph.adjacent('c', 'd')).toBe(false)
      expect(graph.adjacent('d', 'c')).toBe(false)
    })
  })

  describe('#adjacentVertices', () => {
    it('returns keys of the vertices that are adjacent to the vertex', () => {
      expect(graph.adjacentVertices('a')).toEqual(['b', 'c'])
      expect(graph.adjacentVertices('b')).toEqual(['a', 'c', 'd', 'e'])
      expect(graph.adjacentVertices('c')).toEqual(['a', 'b', 'e', 'f'])
    })
  })

  describe('#adjacentValues', () => {
    it('returns keys of the vertices that are adjacent to the vertex', () => {
      expect(graph.adjacentValues('a')).toEqual([b, c])
      expect(graph.adjacentValues('b')).toEqual([a, c, d, e])
      expect(graph.adjacentValues('c')).toEqual([a, b, e, f])
    })
  })

  describe('#filter', () => {
    it('filters the values', () => {
      const result = graph.filter((value, key) => F.elem(key, 'abc'))
      expect(result.keys()).toEqual(['a', 'b', 'c'])
      expect(result.edges()).toEqual([
        ['a', 'b'], ['a', 'c'], ['b', 'a'], ['b', 'c'], ['c', 'a'], ['c', 'b']
      ])
    })
  })

  describe('#traverse', () => {
    it('returns a traverse of the graph from the starting vertex', () => {
      expect(graph.traverse('a')).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
      expect(graph.traverse('g')).toEqual(['g', 'h', 'j', 'i', 'k', 'l'])
    })
  })

  describe('#shortestPath', () => {
    it('returns the shortest path to a matching vertex', () => {
      expect(graph.shortestPath('a', 'a')).toEqual(['a'])
      expect(graph.shortestPath('a', 'b')).toEqual(['a', 'b'])
      expect(graph.shortestPath('f', 'a')).toEqual(['f', 'c', 'a'])
    })

    it('returns an empty path when no matching vertex is found', () => {
      expect(graph.shortestPath('a', 'z')).toEqual([])
    })
  })

  describe('#shortestPathBy', () => {
    const player = F.curry((p, a) => a.player === p)

    it('returns the shortest path to a matching vertex', () => {
      expect(graph.shortestPathBy(player(p), 'a')).toEqual(['a'])
      expect(graph.shortestPathBy(player(q), 'a')).toEqual(['a', 'b'])
      expect(graph.shortestPathBy(player(p), 'f')).toEqual(['f', 'c', 'a'])
    })

    it('returns an empty path when no matching vertex is found', () => {
      expect(graph.shortestPathBy(player(r), 'a')).toEqual([])
    })
  })

  describe('#connectedComponents', () => {
    it('returns the connected components of a graph', () => {
      const result = graph.connectedComponents()

      expect(result.length).toEqual(2)

      expect(result[0].keys()).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
      expect(result[0].edges()).toEqual([
        ['a', 'b'], ['a', 'c'],
        ['b', 'a'], ['b', 'c'], ['b', 'd'], ['b', 'e'],
        ['c', 'a'], ['c', 'b'], ['c', 'e'], ['c', 'f'],
        ['d', 'b'], ['d', 'e'],
        ['e', 'b'], ['e', 'c'], ['e', 'd'], ['e', 'f'],
        ['f', 'c'], ['f', 'e']
      ])

      expect(result[1].keys()).toEqual(['g', 'h', 'i', 'j', 'k', 'l'])
      expect(result[1].edges()).toEqual([
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
