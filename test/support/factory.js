import { array } from 'fkit'

import * as core from '../../src/core'
import Country from '../../src/Country'
import Graph from '../../src/Graph'
import World from '../../src/World'

export function buildCountry (id, player, armies, slots) {
  const country = new Country()

  country.id = id
  country.player = player
  country.armies = armies
  country.slots = array(slots)

  return country
}

export function buildWorld (countries) {
  const world = new World()

  world.graph = new Graph(core.toVertices(countries), [])

  return world
}
