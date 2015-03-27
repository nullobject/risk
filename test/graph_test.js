import F from 'fkit';
import Graph from '../src/graph';

describe('Graph', () => {
  let p = {}, q = {}, r = {}, s = {};

  let a = {id: 'a', player: p},
      b = {id: 'b', player: q},
      c = {id: 'c', player: q},
      d = {id: 'd', player: q},
      e = {id: 'e', player: q},
      f = {id: 'f', player: q},
      g = {id: 'g', player: r},
      h = {id: 'h', player: r},
      i = {id: 'i', player: r},
      j = {id: 'j', player: r},
      k = {id: 'k', player: r},
      l = {id: 'l', player: s};

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
    it('should return the graph size', () => {
      expect(graph.size).to.eql(12);
    });
  });

  describe('#values', () => {
    it('should return the graph values', () => {
      expect(graph.values()).to.eql(values);
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
