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

    it('should move armies for a given player', function() {
      var move   = sandbox.stub(game.world, 'move'),
          player = game.players[0];

      game.move(player, from, to);

      expect(move).to.have.been.calledWith(from, to);
    });
  });
});
