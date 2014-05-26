var CountryStateTransformer = require('../src/country_state_transformer');
var _                       = require('lodash');
var expect                  = require('chai').expect;
var sinon                   = require('sinon');

describe('CountryStateTransformer', function() {
  var sandbox;

  // Country stubs.
  var b = {player: null}, a = {neighbours: [b]};

  // Mixin target stub.
  var target = {
    selectCountry:   function() {},
    deselectCountry: function() {},
    attack:          function() {},
    move:            function() {}
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
        var selectCountry = sandbox.stub(target, 'selectCountry'),
            result        = target.nextAction(null, a),
            country       = result[0],
            action        = result[1];

        action();

        expect(country).to.equal(a)
        expect(selectCountry.calledWith(a)).to.be.true;
      });
    });

    describe('when a country is already selected', function() {
      it('should deselect the country if the same country is selected', function() {
        var deselectCountry = sandbox.stub(target, 'deselectCountry'),
            result          = target.nextAction(a, a),
            country         = result[0],
            action          = result[1];

        action();

        expect(country).to.equal(null)
        expect(deselectCountry.called).to.be.true;
      });

      it('should move the player if a different country is selected', function() {
        var move    = sandbox.stub(target, 'move'),
            result  = target.nextAction(a, b),
            country = result[0],
            action  = result[1];

        action();

        expect(country).to.equal(null)
        expect(move.calledWith(a, b)).to.be.true;
      });
    });
  });
});
