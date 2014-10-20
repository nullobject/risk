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

var find = F.variadic(function(as, bs) {
  return bs.map(function(b) { return F.find(comparator(b), as); });
});

function move(world, s, t) {
  var result = world.move(s, t);
  return find(result.countries, s, t);
}

function attack(world, s, t) {
  var result = world.attack(s, t);
  return find(result.countries, s, t);
}

describe('World', function() {
  var sandbox, world, u, v;

  // Player stubs.
  var a = {}, b = {};

  // Country stubs.
  var s = {id: 1, player: a, armies: 4, slots: F.array(4)},
      t = {id: 2, player: b, armies: 2, slots: F.array(2)};

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    world = new World(800, 600, {}, [s, t], []);
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#move', function() {
    beforeEach(function() {
      var result = move(world, s, t);

      u = result[0];
      v = result[1];
    });

    it('should move to the target country', function() {
      expect(u.player).to.equal(a);
      expect(v.player).to.equal(a);
    });

    it('should distribute the armies', function() {
      expect(u.armies).to.equal(2);
      expect(v.armies).to.equal(2);
    });
  });

  describe('#attack', function() {
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
        expect(u.armies).to.equal(2);
        expect(v.armies).to.equal(2);
      });
    });

    context('when the defender rolls higher than the attacker', function() {
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
        expect(v.armies).to.equal(1);
      });
    });
  });
});
