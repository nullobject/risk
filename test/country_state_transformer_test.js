'use strict';

var CountryStateTransformer = require('../src/country_state_transformer');
var _                       = require('lodash');

describe('CountryStateTransformer', function() {
  var sandbox;

  // Game stub.
  var game = {
    canSelect: function() {},
    canMove:   function() {},
    move:      function() {}
  };

  // Player stub.
  var player = {};

  // Country stubs.
  var b = {player: null},
      a = {armies: 2, neighbours: [b]};

  // Mixin target stub.
  var target = {
    selectCountry:   function() {},
    deselectCountry: function() {}
  };

  // Mixin the transformer into the target.
  _.extend(target, CountryStateTransformer);

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#nextAction', function() {
    describe('when no country is selected', function() {
      it('should select the country', function() {
        var canSelect     = sandbox.stub(game, 'canSelect').returns(true),
            selectCountry = sandbox.stub(target, 'selectCountry'),
            result        = target.nextAction(game, player, null, a),
            country       = result[0],
            action        = result[1];

        action();

        expect(country).to.equal(a)
        expect(canSelect).to.have.been.calledWith(player, a);
        expect(selectCountry).to.have.been.calledWith(a);
      });
    });

    describe('when a country is already selected', function() {
      it('should deselect the country if the same country is selected', function() {
        var deselectCountry = sandbox.stub(target, 'deselectCountry'),
            result          = target.nextAction(game, player, a, a),
            country         = result[0],
            action          = result[1];

        action();

        expect(country).to.equal(null)
        expect(deselectCountry).to.have.been.called;
      });

      it('should move the player if a different country is selected', function() {
        var canMove         = sandbox.stub(game, 'canMove').returns(true),
            move            = sandbox.stub(game, 'move'),
            deselectCountry = sandbox.stub(target, 'deselectCountry'),
            result          = target.nextAction(game, player, a, b),
            country         = result[0],
            action          = result[1];

        action();

        expect(country).to.equal(null)
        expect(canMove).to.have.been.calledWith(player, a, b);
        expect(deselectCountry).to.have.been.called;
        expect(move).to.have.been.calledWith(player, a, b);
      });
    });
  });
});
