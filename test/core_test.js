var core   = require('../src/core');
var expect = require('chai').expect;

describe('core', function() {
  describe('#cartesianProduct', function() {
    it('should return the cartesian product of the given arrays', function() {
      expect(core.cartesianProduct([1, 2], [3, 4])).to.eql([
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4]
      ]);
    });
  });
});
