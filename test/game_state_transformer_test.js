'use strict';

var GameStateTransformer = require('../src/game_state_transformer'),
    _                    = require('lodash');

describe('GameStateTransformer', function() {
  var sandbox;

  // Game stub.
  var game = {
    canSelect: function() {},
    canMove:   function() {}
  };

  // Player stub.
  var player = {};

  // Country stubs.
  var b = {player: null},
      a = {armies: 2, neighbours: [b]};

  // Mixin target stub.
  var target = {game: game};

  // Mixin the transformer into the target.
  _.extend(target, GameStateTransformer);

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#actions', function() {
    describe('when no country is selected', function() {
      it('should select the country', function() {
        sandbox.stub(game, 'canSelect').returns(true);

        var result = target.actions([player, null], [player, a]);

        expect(result[0]).to.eql([player, a])
        expect(result[1]).to.eql([['selectedCountry', a]]);
      });
    });

    describe('when a country is already selected', function() {
      it('should deselect the country if the same country is selected', function() {
        var result = target.actions([player, a], [player, a]);

        expect(result[0]).to.eql([player, null])
        expect(result[1]).to.eql([['selectedCountry', null]]);
      });

      it('should move the player if a different country is selected', function() {
        sandbox.stub(game, 'canMove').returns(true);

        var result = target.actions([player, a], [player, b]);

        expect(result[0]).to.eql([player, null])
        expect(result[1]).to.eql([
          ['move', player, a, b],
          ['selectedCountry', null]
        ]);
      });
    });
  });
});
