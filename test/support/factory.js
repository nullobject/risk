import Country from '../../src/country';
import * as F from 'fkit';
import Graph from '../../src/graph';
import World from '../../src/world';

module.exports = {
  buildCountry: function(id, player, armies, slots) {
    let country = new Country();

    country.id     = id;
    country.player = player;
    country.armies = armies;
    country.slots  = F.array(slots);

    return country;
  },

  buildWorld: function(countries) {
    let world = new World();

    world.graph = new Graph(countries, []);

    return world;
  },
};
