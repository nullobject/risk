import F from 'fkit';
import Graph from '../src/graph';

describe('Graph', () => {
  let p = {}, q = {}, r = {}, s = {};

  let a = {id: 'a', player: p, score: 1},
      b = {id: 'b', player: q, score: 2},
      c = {id: 'c', player: q, score: 3},
      d = {id: 'd', player: q, score: 4},
      e = {id: 'e', player: q, score: 5},
      f = {id: 'f', player: q, score: 6},
      g = {id: 'g', player: r, score: 7},
      h = {id: 'h', player: r, score: 8},
      i = {id: 'i', player: r, score: 9},
      j = {id: 'j', player: r, score: 10},
      k = {id: 'k', player: r, score: 11},
      l = {id: 'l', player: s, score: 12};

  let values = [a, b, c, d, e, f, g, h, i, j, k, l];

  let edges = [
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
  ];

  let graph = new Graph(values, edges);

  describe('#size', () => {
    it('should return the number of vertices', () => {
      expect(graph.size).to.eq(12);
    });
  });

  describe('#first', () => {
    it('should return the first vertex', () => {
      expect(graph.first()).to.eq(a);
    });
  });

  describe('#last', () => {
    it('should return the last vertex', () => {
      expect(graph.last()).to.eq(l);
    });
  });

  describe('#get', () => {
    it('should return the vertex with the given key', () => {
      expect(graph.get('a')).to.eq(a);
      expect(graph.get('l')).to.eq(l);
    });
  });

  describe('#merge', () => {
    it('should merge the given vertices', () => {
      let m = {id: 'm', player: s, score: 13};
      expect(graph.merge([m]).last()).to.eq(m);
    });
  });

  describe('#update', () => {
    it('should update the vertex with the given key', () => {
      let graph_ = graph.update('a', F.update('score', F.inc));
      expect(graph_.get('a').score).to.eq(2);
    });
  });

  describe('#keys', () => {
    it('should return the vertex keys', () => {
      expect(graph.keys()).to.eql(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']);
    });
  });

  describe('#values', () => {
    it('should return the vertex values', () => {
      expect(graph.values()).to.eql(values);
    });
  });

  describe('#edges', () => {
    it('should return the edges', () => {
      expect(graph.edges()).to.eql(edges);
    });
  });

  describe('#addVertex', () => {
    it('should add a vertex with the given key and value', () => {
      let m = {id: 'm', player: s, score: 13};
      expect(graph.addVertex(m.id, m).last()).to.eql(m);
    });
  });

  describe('#removeVertex', () => {
    it('should remove the vertex with the given key', () => {
      expect(graph.removeVertex('l').get('l')).to.be.undefined;
    });
  });

  describe('#addEdge', () => {
    it('should connect the vertices with the given keys', () => {
      expect(graph.adjacent('c', 'd')).to.be.false;
      let graph_ = graph.addEdge('c', 'd');
      expect(graph_.adjacent('c', 'd')).to.be.true;
    });
  });

  describe('#removeEdge', () => {
    it('should connect the vertices with the given keys', () => {
      expect(graph.adjacent('a', 'b')).to.be.true;
      let graph_ = graph.removeEdge('a', 'b');
      expect(graph_.adjacent('a', 'b')).to.be.false;
    });
  });

  describe('#adjacent', () => {
    it('should return true for vertices that are adjacent', () => {
      expect(graph.adjacent('a', 'b')).to.be.true;
      expect(graph.adjacent('b', 'a')).to.be.true;
    });

    it('should return false for vertices that are not adjacent', () => {
      expect(graph.adjacent('c', 'd')).to.be.false;
      expect(graph.adjacent('d', 'c')).to.be.false;
    });
  });

  describe('#adjacentVertices', () => {
    it('should return keys of the vertices that are adjacent to the vertex', () => {
      expect(graph.adjacentVertices('a')).to.eql(['b', 'c']);
      expect(graph.adjacentVertices('b')).to.eql(['a', 'c', 'd', 'e']);
      expect(graph.adjacentVertices('c')).to.eql(['a', 'b', 'e', 'f']);
    });
  });

  describe('#adjacentValues', () => {
    it('should return keys of the vertices that are adjacent to the vertex', () => {
      expect(graph.adjacentValues('a')).to.eql([b, c]);
      expect(graph.adjacentValues('b')).to.eql([a, c, d, e]);
      expect(graph.adjacentValues('c')).to.eql([a, b, e, f]);
    });
  });

  describe('#filter', () => {
    it('should filter the values', () => {
      let result = graph.filter((value, key) => F.elem(key, 'abc'));
      expect(result.keys()).to.eql(['a', 'b', 'c']);
      expect(result.edges()).to.eql([
        ['a', 'b'], ['a', 'c'], ['b', 'a'], ['b', 'c'], ['c', 'a'], ['c', 'b']
      ]);
    });
  });

  describe('#traverse', () => {
    it('should return a traverse of the graph from the starting vertex', () => {
      expect(graph.traverse('a')).to.eql(['a', 'b', 'c', 'd', 'e', 'f']);
      expect(graph.traverse('g')).to.eql(['g', 'h', 'j', 'i', 'k', 'l']);
    });
  });

  describe('#shortestPath', () => {
    it('should return the shortest path to a matching vertex', () => {
      expect(graph.shortestPath('a', 'a')).to.eql(['a']);
      expect(graph.shortestPath('a', 'b')).to.eql(['a', 'b']);
      expect(graph.shortestPath('f', 'a')).to.eql(['f', 'c', 'a']);
    });

    it('should return an empty path when no matching vertex is found', () => {
      expect(graph.shortestPath('a', 'z')).to.eql([]);
    });
  });

  describe('#shortestPathBy', () => {
    let player = F.curry((p, a) => a.player === p);

    it('should return the shortest path to a matching vertex', () => {
      expect(graph.shortestPathBy(player(p), 'a')).to.eql(['a']);
      expect(graph.shortestPathBy(player(q), 'a')).to.eql(['a', 'b']);
      expect(graph.shortestPathBy(player(p), 'f')).to.eql(['f', 'c', 'a']);
    });

    it('should return an empty path when no matching vertex is found', () => {
      expect(graph.shortestPathBy(player(r), 'a')).to.eql([]);
    });
  });

  describe('#connectedComponents', () => {
    it('should return the connected components of a graph', () => {
      let result = graph.connectedComponents();

      expect(result.length).to.eql(2);

      expect(result[0].keys()).to.eql(['a', 'b', 'c', 'd', 'e', 'f']);
      expect(result[0].edges()).to.eql([
        ['a', 'b'], ['a', 'c'],
        ['b', 'a'], ['b', 'c'], ['b', 'd'], ['b', 'e'],
        ['c', 'a'], ['c', 'b'], ['c', 'e'], ['c', 'f'],
        ['d', 'b'], ['d', 'e'],
        ['e', 'b'], ['e', 'c'], ['e', 'd'], ['e', 'f'],
        ['f', 'c'], ['f', 'e']
      ]);

      expect(result[1].keys()).to.eql(['g', 'h', 'i', 'j', 'k', 'l']);
      expect(result[1].edges()).to.eql([
        ['g', 'h'], ['g', 'j'],
        ['h', 'g'], ['h', 'i'], ['h', 'j'], ['h', 'k'],
        ['i', 'h'], ['i', 'k'],
        ['j', 'g'], ['j', 'h'], ['j', 'k'], ['j', 'l'],
        ['k', 'h'], ['k', 'i'], ['k', 'j'], ['k', 'l'],
        ['l', 'j'], ['l', 'k']
      ]);
    });
  });
});
