import * as graph from '../src/graph';
import * as F from 'fkit';

describe('graph', () => {
  var a = {id: 'a'}, b = {id: 'b'}, c = {id: 'c'}, d = {id: 'd'}, e = {id: 'e'}, f = {id: 'f'};

  a.neighbours = [];
  b.neighbours = [c];
  c.neighbours = [b];
  d.neighbours = [e, f];
  e.neighbours = [d, f];
  f.neighbours = [d, e];

  // The adjacency function.
  var x = n => n.neighbours;

  describe('.traverse', () => {
    it('should depth-first traverse a graph', () => {
      expect(graph.traverse(x, a)).to.eql([a]);
      expect(graph.traverse(x, b)).to.eql([b, c]);
      expect(graph.traverse(x, d)).to.eql([d, e, f]);
    });
  });

  describe('.calculateIslands', () => {
    it('should calculate islands of connected nodes in a graph', () => {
      expect(graph.calculateIslands(x, [a, b, c, d, e, f])).to.eql([[a], [b, c], [d, e, f]]);
    });
  });
});
