import {array} from 'fkit'
import Country from '../../src/country'
import Graph from '../../src/graph'
import World from '../../src/world'

module.exports = {
  buildCountry: function (id, player, armies, slots) {
    const country = new Country()

    country.id = id
    country.player = player
    country.armies = armies
    country.slots = array(slots)

    return country
  },

  buildWorld: function (countries) {
    const world = new World()

    world.graph = new Graph(countries, [])

    return world
  }
}
