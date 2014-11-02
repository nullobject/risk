'use strict';

var AI = require('../src/ai');

describe('AI', function() {
  var ai;

  beforeEach(function() {
    ai = new AI();
  });

  describe('#nextMove', function() {
    it('should calculate the next move', function() {
      expect(ai.nextMove()).to.have.property('type', 'end-turn');
    });
  });
});
