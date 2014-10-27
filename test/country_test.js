'use strict';

var factory = require('./support/factory');

describe('Country', function() {
  var country = factory.buildCountry(1, null, [2, 3], 2, 3);

  describe('#availableSlots', function() {
    it('should add armies', function() {
      expect(country.availableSlots).to.equal(1);
    });
  });

  describe('#hasNeighbour', function() {
    it('should be true if the country has the given neighbour', function() {
      expect(country.hasNeighbour({id: 2})).to.be.true;
      expect(country.hasNeighbour({id: 3})).to.be.true;
      expect(country.hasNeighbour({id: 4})).to.be.false;
    });
  });

  describe('#reinforce', function() {
    it('should add armies', function() {
      var result = country.reinforce(1);
      expect(result.armies).to.equal(3);
    });

    it('should not add more armies than available slots', function() {
      var result = country.reinforce(2);
      expect(result.armies).to.equal(3);
    });
  });
});
