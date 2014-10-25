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
});
