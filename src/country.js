import F from 'fkit';

export default class Country {
  constructor(id, size, polygon, slots) {
    let a = arguments;

    if (a.length > 0) {
      this.id      = id;
      this.size    = size;
      this.polygon = polygon;
      this.slots   = slots;
      this.armies  = 0;
      this.player  = null;
    }
  }

  get availableSlots() { return this.slots.length - this.armies; }

  hashCode() {
    return this.id;
  }

  toString() {
    return 'country-' + this.id;
  }

  reinforce(n) {
    if (n <= 0) {
      return this;
    } else {
      let f = F.compose(F.min(this.slots.length), F.add(n));
      return F.update('armies', f, this);
    }
  }
}
