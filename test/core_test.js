'use strict';

var core      = require('../src/core'),
    Immutable = require('immutable');

describe('core', function() {
  describe('.clamp', function() {
    it('should clamp a value', function() {
      expect(core.clamp(0, 1, 2)).to.eql(1);
      expect(core.clamp(1, 1, 2)).to.eql(1);
      expect(core.clamp(2, 1, 2)).to.eql(2);
      expect(core.clamp(3, 1, 2)).to.eql(2);
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
