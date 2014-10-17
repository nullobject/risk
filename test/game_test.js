'use strict';

var Game = require('../src/game');

describe('Game', function() {
  var sandbox;

  // Player stub.
  var player = {};

  // Country stubs.
  var a = {},
      b = {};

  // World stub.
  var world = {
    countries:     [a, b],
    assignPlayers: function() {},
    move:          function() {}
  };

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(world, 'assignPlayers').returns(world);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#moveToCountry', function() {
    it('should move armies from the selected country to the given country', function() {
      var game = new Game(world);
      game.currentPlayer = player;
      game.selectedCountry = a;

      var mock = sandbox
        .mock(world)
        .expects('move')
        .withArgs(player, a, b)
        .once()
        .returns(world);

      var result = game.moveToCountry(b);

      expect(result.selectedCountry).to.be.null;
      expect(result.world).to.equal(world);
      mock.verify();
    });
  });
});
