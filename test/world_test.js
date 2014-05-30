'use strict';

var World = require('../src/world');

function buildWorld(countries) {
  return new World(null, countries, null);
}

describe('World', function() {
  describe('#move', function() {
    it('should move armies from the from country to the to country', function() {
      var from  = {armies: 10},
          to    = {armies: 0},
          world = buildWorld([from, to]);

      world.move(from, to);

      expect(from.armies).to.equal(1);
      expect(to.armies).to.equal(9);
    });

    it('should assert the from country is in the world', function() {
      var from  = {armies: 10},
          to    = {armies: 0},
          world = buildWorld([to]);

      expect(function() {
        world.move(from, to);
      }).to.throw("The 'from' country is not in the world");
    });

    it('should assert the to country is in the world', function() {
      var from  = {armies: 10},
          to    = {armies: 0},
          world = buildWorld([from]);

      expect(function() {
        world.move(from, to);
      }).to.throw("The 'to' country is not in the world");
    });

    it('should assert the from country has armies to move', function() {
      var from  = {armies: 1},
          to    = {armies: 10},
          world = buildWorld([from, to]);

      expect(function() {
        world.move(from, to);
      }).to.throw("The 'from' country does not have enough armies");
    });

    it('should assert the from country belongs to the player');
    it('should assert the to country does not belong to the player');
  });
});
