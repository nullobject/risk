var World = require('../src/world');
var expect = require('chai').expect;

function w(countries) {
  return new World(null, countries, null);
}

describe('World', function() {
  describe('#move', function() {
    it('should move armies from the source country to the target country', function() {
      var source = {armies: 10},
          target = {armies: 0},
          world = w([source, target]);

      world.move(source, target);

      expect(source.armies).to.equal(1);
      expect(target.armies).to.equal(9);
    });

    it('should assert the source country is in the world', function() {
      var source = {armies: 10},
          target = {armies: 0},
          world = w([target]);

      expect(function() {
        world.move(source, target);
      }).to.throw('Source country is not in the world');
    });

    it('should assert the target country is in the world', function() {
      var source = {armies: 10},
          target = {armies: 0},
          world = w([source]);

      expect(function() {
        world.move(source, target);
      }).to.throw('Target country is not in the world');
    });

    it('should assert the source country has armies to move', function() {
      var source = {armies: 1},
          target = {armies: 10},
          world = w([source, target]);

      expect(function() {
        world.move(source, target);
      }).to.throw('Source country does not have enough armies');
    });

    it('should assert the source country belongs to the player');
    it('should assert the target country does not belong to the player');
  });
});
