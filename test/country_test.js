import factory from './support/factory'
import {assert} from 'chai'

describe('Country', () => {
  const country = factory.buildCountry(1, [2, 3], 2, 3)

  describe('#availableSlots', () => {
    it('should add armies', () => {
      assert.equal(country.availableSlots, 1)
    })
  })

  describe('#reinforce', () => {
    it('should add armies', () => {
      let result = country.reinforce(1)
      assert.equal(result.armies, 3)
    })

    it('should not add more armies than available slots', () => {
      let result = country.reinforce(2)
      assert.equal(result.armies, 3)
    })
  })
})
