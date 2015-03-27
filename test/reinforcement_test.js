import F from 'fkit';
import * as reinforcement from '../src/reinforcement';
import Graph from '../src/graph';

describe('reinforcement', () => {
  let p = {}, q = {};

  let values = [
    {id: 'a', player: p, availableSlots: 0},
    {id: 'b', player: q, availableSlots: 2},
    {id: 'c', player: q, availableSlots: 1},
    {id: 'd', player: q, availableSlots: 1},
    {id: 'e', player: q, availableSlots: 0},
    {id: 'f', player: q, availableSlots: 0}
  ];

  let edges = [
    ['a', 'b'], ['a', 'c'],
    ['b', 'a'], ['b', 'c'], ['b', 'd'], ['b', 'e'],
    ['c', 'a'], ['c', 'b'], ['c', 'e'], ['c', 'f'],
    ['d', 'b'], ['d', 'e'],
    ['e', 'b'], ['e', 'c'], ['e', 'd'], ['e', 'f'],
    ['f', 'c'], ['f', 'e']
  ];

  let graph = new Graph(values, edges);

  describe('.depthIndex', () => {
    it('should return the depth index for the player subgraphs', () => {
      let subgraphs = graph
        .filter(country => country.player === q)
        .connectedComponents();

      expect(reinforcement.depthIndex(graph, subgraphs)).to.eql([['b', 'c'], ['f', 'd', 'e']]);
    });
  });

  describe('.reinforcementMap', () => {
    it('should return the reinforcement map for the player countries', () => {
      let subgraphs = graph
        .filter(country => country.player === q)
        .connectedComponents();
      let depthIndex = [['b', 'c'], ['f', 'd', 'e']];
      expect(reinforcement.reinforcementMap(graph, subgraphs, depthIndex)).to.eql({'b': 2, 'c': 1, 'd': 1, 'e': 0, 'f': 0});
    });
  });
});
