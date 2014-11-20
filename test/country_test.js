import * as factory from './support/factory';

describe('Country', () => {
  var country = factory.buildCountry(1, null, [2, 3], 2, 3);

  describe('#availableSlots', () => {
    it('should add armies', () => {
      expect(country.availableSlots).to.equal(1);
    });
  });

  describe('#hasNeighbour', () => {
    it('should be true if the country has the given neighbour', () => {
      expect(country.hasNeighbour({id: 2})).to.be.true;
      expect(country.hasNeighbour({id: 3})).to.be.true;
      expect(country.hasNeighbour({id: 4})).to.be.false;
    });
  });

  describe('#reinforce', () => {
    it('should add armies', () => {
      var result = country.reinforce(1);
      expect(result.armies).to.equal(3);
    });

    it('should not add more armies than available slots', () => {
      var result = country.reinforce(2);
      expect(result.armies).to.equal(3);
    });
  });
});
