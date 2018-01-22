import {add, compose, min, update} from 'fkit'

export default class Country {
  constructor (id, size, polygon, slots) {
    let a = arguments

    if (a.length > 0) {
      this.id = id
      this.size = size
      this.polygon = polygon
      this.slots = slots
      this.armies = 0
      this.player = null
    }
  }

  get availableSlots () { return this.slots.length - this.armies }

  hashCode () {
    return this.id
  }

  toString () {
    return 'country-' + this.id
  }

  reinforce (n) {
    if (n <= 0) {
      return this
    } else {
      let f = compose(min(this.slots.length), add(n))
      return update('armies', f, this)
    }
  }
}
