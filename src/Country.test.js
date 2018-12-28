import { buildCountry } from '../test/support/factory'

describe('Country', () => {
  const country = buildCountry(1, [2, 3], 2, 3)

  describe('#availableSlots', () => {
    it('adds armies', () => {
      expect(country.availableSlots).toBe(1)
    })
  })

  describe('#reinforce', () => {
    it('adds armies', () => {
      let result = country.reinforce(1)
      expect(result.armies).toBe(3)
    })

    it('does not add more armies than available slots', () => {
      let result = country.reinforce(2)
      expect(result.armies).toBe(3)
    })
  })
})
