'use strict';

var rewire  = require('rewire'),
    factory = require('./support/factory'),
    F       = require('fkit'),
    World   = rewire('../src/world');

var core = World.__get__('core');

// Stub each call to the `rollDice` function with the return values in the
// list of `xss`.
var stubRollDice = F.variadic(function(sandbox, xss) {
  var stub = sandbox.stub(core, 'rollDice');
  xss.map(function(xs, i) { stub.onCall(i).returns(xs); });
});

function find(as, bs) {
  return bs.map(function(q) {
    return F.find(comparator(q), as);
  });

  function comparator(p) {
    return F.compose(F.eq(p.id), F.get('id'));
  }
}

function move(world, a, b) {
  var result = world.move(a, b);
  return find(result.countries, [a, b]);
}

function attack(world, a, b) {
  var result = world.attack(a, b);
  return find(result.countries, [a, b]);
}

function reinforce(world, a, b, c) {
  var result = world.reinforce([a, b, c]);
  return find(result.countries, [a, b, c]);
}

describe('World', function() {
  var sandbox, x, y, z;

  // Player stubs.
  var p = {}, q = {};

  // Country stubs.
  var p1 = factory.buildCountry(1, p, [], 4, 4),
      p2 = factory.buildCountry(2, p, [], 2, 3),
      p3 = factory.buildCountry(3, p, [], 1, 2),
      q1 = factory.buildCountry(4, q, [], 2, 2);

  var world = factory.buildWorld([p1, p2, p3, q1]);

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#move', function() {
    beforeEach(function() {
      var result = move(world, p1, q1);

      x = result[0];
      y = result[1];
    });

    it('should move to the target country', function() {
      expect(x.player).to.equal(p);
      expect(y.player).to.equal(p);
    });

    it('should distribute the armies', function() {
      expect(x.armies).to.equal(2);
      expect(y.armies).to.equal(2);
    });
  });

  describe('#attack', function() {
    context('when the attacker rolls higher than the defender', function() {
      beforeEach(function() {
        stubRollDice(sandbox, [6, 4, 2, 1], [6, 5]);

        var result = attack(world, p1, q1);

        x = result[0];
        y = result[1];
      });

      it('should move the attacker to target country', function() {
        expect(x.player).to.equal(p);
        expect(y.player).to.equal(p);
      });

      it('should update the armies', function() {
        expect(x.armies).to.equal(2);
        expect(y.armies).to.equal(1);
      });
    });

    context('when the attacker rolls equal to the defender', function() {
      beforeEach(function() {
        stubRollDice(sandbox, [5, 1, 1, 1], [6, 4]);

        var result = attack(world, p1, q1);

        x = result[0];
        y = result[1];
      });

      it('should not move the attacker', function() {
        expect(x.player).to.equal(p);
        expect(y.player).to.equal(q);
      });

      it('should update the armies', function() {
        expect(x.armies).to.equal(2);
        expect(y.armies).to.equal(2);
      });
    });

    context('when the attacker rolls lower than the defender', function() {
      beforeEach(function() {
        stubRollDice(sandbox, [5, 2, 1, 1], [6, 4]);

        var result = attack(world, p1, q1);

        x = result[0];
        y = result[1];
      });

      it('should not move the attacker', function() {
        expect(x.player).to.equal(p);
        expect(y.player).to.equal(q);
      });

      it('should update the armies', function() {
        expect(x.armies).to.equal(2);
        expect(y.armies).to.equal(2);
      });
    });
  });

  describe('#reinforce', function() {
    it('should reinforce the countries', function() {
      sandbox.stub(core, 'distribute').returns([0, 1, 2]);

      var result = reinforce(world, p1, p2, p3);

      x = result[0];
      y = result[1];
      z = result[2];

      expect(x.armies).to.equal(4);
      expect(y.armies).to.equal(3);
      expect(z.armies).to.equal(2);
    });
  });
});
