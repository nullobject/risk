var Country = require('../../src/country'),
    World   = require('../../src/world'),
    F       = require('fkit');

module.exports = {
  buildCountry: function(id, player, neighbourIds, armies, slots) {
    var country = new Country();

    country.id           = id;
    country.player       = player;
    country.neighbourIds = neighbourIds;
    country.armies       = armies;
    country.slots        = F.array(slots);

    return country;
  },

  buildWorld: function(countries) {
    var world = new World();

    world.countries = countries;

    return world;
  },
};
