'use strict';

var rewire = require('rewire');

var F     = require('fkit'),
    World = rewire('../src/world');

// Stub each call to the `rollDice` function with the return values in the
// list of `xss`.
var stubRollDice = F.variadic(function(sandbox, xss) {
  var core = World.__get__('core'),
      stub = sandbox.stub(core, 'rollDice');

  xss.map(function(xs, i) { stub.onCall(i).returns(xs); });
});

function comparator(a) {
  return F.compose(F.eq(a.id), F.get('id'));
}

function attack(world, s, t) {
  var result = world.attack(s, t);

  var u = F.find(comparator(s), result.countries),
      v = F.find(comparator(t), result.countries);

  return [u, v];
}

describe('World', function() {
  var sandbox, world;

  // Player stubs.
  var a = {},
      b = {};

  // Country stubs.
  var s = {id: 1, player: a, armies: 4},
      t = {id: 2, player: b, armies: 2};

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    world = new World(800, 600, {}, [s, t], []);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#move', function() {
    it('should move to the target country', function() {
      var result = attack(world, s, t),
          u      = result[0],
          v      = result[1];

      expect(u.player).to.equal(a);
      expect(v.player).to.equal(a);

      expect(u.armies).to.equal(1);
      expect(v.armies).to.equal(3);
    });
  });

  describe('#attack', function() {
    var u, v;

    context('when the attacker rolls higher than the defender', function() {
      beforeEach(function() {
        stubRollDice(sandbox, [3, 4], [1, 2]);

        var result = attack(world, s, t);

        u = result[0];
        v = result[1];
      });

      it('should move the attacker to target country', function() {
        expect(u.player).to.equal(a);
        expect(v.player).to.equal(a);
      });

      it('should distribute the armies', function() {
        expect(u.armies).to.equal(1);
        expect(v.armies).to.equal(3);
      });
    });

    context('when the attacker rolls lower than the defender', function() {
      var u, v;

      beforeEach(function() {
        stubRollDice(sandbox, [1, 2], [3, 4]);

        var result = attack(world, s, t);

        u = result[0];
        v = result[1];
      });

      it('should not move the attacker', function() {
        expect(u.player).to.equal(a);
        expect(v.player).to.equal(b);
      });

      it('should update the armies', function() {
        expect(u.armies).to.equal(1);
        expect(v.armies).to.equal(2);
      });
    });
  });
});
