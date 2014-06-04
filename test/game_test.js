'use strict';

var Game = require('../src/game');

function buildGame(countries) {
  return new Game(800, 600, function() {
    return {countries: countries};
  });
}

describe('Game', function() {
  // Stub player.
  var player = {};

  describe('#move', function() {
    it('should move armies from the from country to the to country', function() {
      var a    = {armies: 2, player: player},
          b    = {armies: 0, player: null},
          game = buildGame([a, b]);

      game.move(player, a, b);

      expect(a.armies).to.equal(1);
      expect(b.armies).to.equal(1);
    });

    it('should assert the from country is in the world', function() {
      var a    = {armies: 2, player: player},
          b    = {armies: 0, player: null},
          game = buildGame([b]);

      expect(function() {
        game.move(player, a, b);
      }).to.throw("The 'from' country is not in the world");
    });

    it('should assert the to country is in the world', function() {
      var a    = {armies: 2, player: player},
          b    = {armies: 0, player: null},
          game = buildGame([a]);

      expect(function() {
        game.move(player, a, b);
      }).to.throw("The 'to' country is not in the world");
    });

    it('should assert the from country has armies to move', function() {
      var a    = {armies: 0, player: player},
          b    = {armies: 0, player: null},
          game = buildGame([a, b]);

      expect(function() {
        game.move(player, a, b);
      }).to.throw("The 'from' country does not have enough armies");
    });

    it('should assert the from country belongs to the player', function() {
      var a    = {armies: 2, player: null},
          b    = {armies: 0, player: null},
          game = buildGame([a, b]);

      expect(function() {
        game.move(player, a, b);
      }).to.throw("The 'from' country does not belong to the player");
    });

    it('should assert the to country does not belong to the player', function() {
      var a    = {armies: 2, player: player},
          b    = {armies: 0, player: player},
          game = buildGame([a, b]);

      expect(function() {
        game.move(player, a, b);
      }).to.throw("The 'to' country belongs to the player");
    });
  });
});
