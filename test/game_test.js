'use strict';

var Game = require('../src/game');

function buildGame() {
  return new Game(800, 600);
}

describe('Game', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#move', function() {
    var game = buildGame(),
        from = {},
        to   = {};

    it('should move armies from the from country to the to country', function() {
      var move   = sandbox.stub(game.world, 'move'),
          player = game.players[0];

      game.move(player, from, to);

      expect(move).to.have.been.calledWith(from, to);
    });

    it('should assert the player is current', function() {
      var player = {};

      expect(function() {
        game.move(player, from, to);
      }).to.throw("The player isn't current");
    });
  });
});
