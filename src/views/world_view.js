import CountryView from './country_view'
import PathsView from './paths_view'
import React from 'react'
import styles from '../../assets/stylesheets/styles.scss'

export default ({bus, cells, game}) =>
  <g className={styles.world}>
    <g className={styles.countries}>{renderCountries(bus, game)}</g>
    {renderCells(game, cells)}
  </g>

function isNearby (game, country) { return game.canMoveToCountry(country) }
function isSelected (game, country) { return country === game.selectedCountry }

function renderCountries (bus, game) {
  return game.world.countries.map(country => {
    const nearby = isNearby(game, country)
    const selected = isSelected(game, country)

    return (
      <CountryView
        key={country}
        country={country}
        nearby={nearby}
        selected={selected}
        bus={bus}
      />
    )
  })
}

function renderCells (game, cells) {
  return cells ? (
    <PathsView className={styles.voronoi} paths={game.world.cells} />
  ) : null
}
