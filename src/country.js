import * as F from 'fkit';
import * as Immutable from 'immutable';

export default class Country {
  constructor(id, size, neighbourIds, polygon, slots) {
    var a = arguments;

    if (a.length > 0) {
      this.id           = id;
      this.size         = size;
      this.neighbourIds = neighbourIds;
      this.polygon      = polygon;
      this.slots        = slots;
      this.armies       = 0;
      this.player       = null;
    }
  }

  get neighbourIds() { return this.neighbourIdsSet.toArray(); }
  set neighbourIds(as) { this.neighbourIdsSet = Immutable.Set(as); }

  get availableSlots() { return this.slots.length - this.armies; }

  /**
   * Returns true if a given country neighbours this country, false otherwise.
   */
  hasNeighbour(country) {
    return this.neighbourIdsSet.contains(country.id);
  }

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
      var f = F.compose(F.min(this.slots.length), F.add(n));
      return F.update('armies', f, this);
    }
  }

  /**
   * Recalculates the neighbours using the list of `countries`.
   */
  recalculateNeighbours(countries) {
    var countryIds = countries.map(F.get('id'));

    // Filter neighbours which are in the list of country IDs.
    var neighbourIds = this.neighbourIds.filter(F.flip(F.elem, countryIds));

    return F.copy(this, {neighbourIds: neighbourIds});
  }
}
