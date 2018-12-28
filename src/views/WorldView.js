import React from 'react'

import CountryView from './CountryView'
import PathsView from './PathsView'
import styles from '../../assets/stylesheets/styles.scss'

export default ({ bus, cells, game }) =>
  <g className={styles.world}>
    <g className={styles.countries}>{renderCountries(bus, game)}</g>
    {renderCells(game, cells)}
  </g>

function renderCountries (bus, game) {
  return game.world.countries.map(country => {
    const enabled = game.canSelectCountry(country) || game.canMoveToCountry(country)
    const nearby = game.canMoveToCountry(country)
    const selected = country === game.selectedCountry

    return (
      <CountryView
        bus={bus}
        country={country}
        enabled={enabled}
        key={country}
        nearby={nearby}
        selected={selected}
      />
    )
  })
}

function renderCells (game, cells) {
  return cells ? (
    <PathsView className={styles.voronoi} paths={game.world.cells} />
  ) : null
}
