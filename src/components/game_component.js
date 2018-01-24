import CountryComponent from './country_component'
import PathsComponent from './paths_component'
import React from 'react'
import log from '../log'
import styles from '../styles.scss'

function isNearby (game, country) { return game.canMoveToCountry(country) }
function isSelected (game, country) { return country === game.selectedCountry }

export default class GameComponent extends React.PureComponent {
  render () {
    const bus = this.props.bus
    const game = this.props.game

    log.debug('GameComponent#render')

    return (
      /* jshint ignore:start */
      <g className={styles.world}>
        <g className={styles.countries}>{this.renderCountries(bus, game)}</g>
        {this.renderCells(game)}
      </g>
      /* jshint ignore:end */
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
        /* jshint ignore:start */
        <CountryComponent
          key={country}
          country={country}
          nearby={nearby}
          selected={selected}
          bus={bus}
        />
        /* jshint ignore:end */
      )
    }
  }

  renderCells (game) {
    return this.props.cells ? (
      /* jshint ignore:start */
      <PathsComponent className={styles.voronoi} paths={game.world.cells} />
      /* jshint ignore:end */
    ) : null
  }
}
