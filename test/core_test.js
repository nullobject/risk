'use strict';

var core      = require('../src/core'),
    Immutable = require('immutable');

describe('core', function() {
  describe('.replace', function() {
    it('should move to the target country', function() {
      var s = {id: 1, name: 's'},
          t = {id: 2, name: 't'},
          u = {id: 1, name: 'u'},
          v = {id: 2, name: 'v'};

      var set = Immutable.Set.from([s, t]);

      expect(core.replace([s, t], [u, v], set).toArray()).to.eql([u, v]);
    });
  });

  describe('.distribute', function() {
    it('should distribute the units', function() {
      expect(core.distribute(0, [1, 2, 3])).to.eql([0, 0, 0]);
      expect(core.distribute(1, [1, 2, 3])).to.eql([1, 0, 0]);
      expect(core.distribute(2, [1, 2, 3])).to.eql([1, 1, 0]);
      expect(core.distribute(3, [1, 2, 3])).to.eql([1, 1, 1]);
      expect(core.distribute(4, [1, 2, 3])).to.eql([1, 2, 1]);
      expect(core.distribute(5, [1, 2, 3])).to.eql([1, 2, 2]);
      expect(core.distribute(6, [1, 2, 3])).to.eql([1, 2, 3]);
      expect(core.distribute(7, [1, 2, 3])).to.eql([1, 2, 3]);
    });
  });
});
