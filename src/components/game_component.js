import CountryComponent from './country_component'
import PathsComponent from './paths_component'
import React from 'react'
import log from '../log'
import styles from '../stylesheets/styles.scss'

function isNearby (game, country) { return game.canMoveToCountry(country) }
function isSelected (game, country) { return country === game.selectedCountry }

export default class GameComponent extends React.PureComponent {
  render () {
    const bus = this.props.bus
    const game = this.props.game

    log.debug('GameComponent#render')

    return (
      <g className={styles.world}>
        <g className={styles.countries}>{this.renderCountries(bus, game)}</g>
        {this.renderCells(game)}
      </g>
    )
  }

  renderCountries (bus, game) {
    return game.world.countries.map(this.renderCountry(bus, game))
  }

  renderCountry (bus, game) {
    return (country) => {
      const nearby = isNearby(game, country)
      const selected = isSelected(game, country)

      return (
        <CountryComponent
          key={country}
          country={country}
          nearby={nearby}
          selected={selected}
          bus={bus}
        />
      )
    }
  }

  renderCells (game) {
    return this.props.cells ? (
      <PathsComponent className={styles.voronoi} paths={game.world.cells} />
    ) : null
  }
}
