'use strict';

var Game = require('../src/game');

describe('Game', function() {
  var sandbox, game;

  // Player stub.
  var player = {};

  // Country stubs.
  var source = {},
      target = {};

  // World stub.
  var world = {
    countries:     [source, target],
    assignPlayers: function() {},
    move:          function() {},
    attack:        function() {}
  };

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(world, 'assignPlayers').returns(world);
    game = new Game(world);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#moveToCountry', function() {
    beforeEach(function() {
      game.currentPlayer = player;
      game.selectedCountry = source;
    });

    it('should move to the target country if the selected country is unoccupied', function() {
      var newWorld = {};

      var mock = sandbox
        .mock(world)
        .expects('move')
        .withArgs(source, target)
        .once()
        .returns(newWorld);

      var result = game.moveToCountry(target);

      expect(result.selectedCountry).to.be.null;
      expect(result.world).to.equal(newWorld);

      mock.verify();
    });

    it('should attack the target country if the selected country is occupied', function() {
      target.player = {};

      var newWorld = {};

      var mock = sandbox
        .mock(world)
        .expects('attack')
        .withArgs(source, target)
        .once()
        .returns(newWorld);

      var result = game.moveToCountry(target);

      expect(result.selectedCountry).to.be.null;
      expect(result.world).to.equal(newWorld);

      mock.verify();
    });
  });
});
