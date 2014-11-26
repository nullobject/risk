import * as factory from './support/factory';

describe('Country', () => {
  let country = factory.buildCountry(1, [2, 3], 2, 3);

  describe('#availableSlots', () => {
    it('should add armies', () => {
      expect(country.availableSlots).to.equal(1);
    });
  });

  describe('#reinforce', () => {
    it('should add armies', () => {
      let result = country.reinforce(1);
      expect(result.armies).to.equal(3);
    });

    it('should not add more armies than available slots', () => {
      let result = country.reinforce(2);
      expect(result.armies).to.equal(3);
    });
  });
});
