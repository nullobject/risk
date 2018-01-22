import * as core from '../core';
import CountryComponent from './country_component';
import PathsComponent from './paths_component';
import React from 'react';
import styles from '../styles.scss'

function isNearby(game, country) { return game.canMoveToCountry(country); }
function isSelected(game, country) { return country === game.selectedCountry; }

export default class GameComponent extends React.PureComponent {
  render() {
    let stream = this.props.stream,
        game   = this.props.game;

    core.log('GameComponent#render');

    return (
      /* jshint ignore:start */
      <g className={styles.world}>
        <g className={styles.countries}>{this.renderCountries(stream, game)}</g>
        {this.renderCells(game)}
      </g>
      /* jshint ignore:end */
    );
  }

  renderCountries(stream, game) {
    return game.world.countries.map(this.renderCountry(stream, game));
  }

  renderCountry(stream, game) {
    return (country) => {
      let nearby   = isNearby(game, country),
          selected = isSelected(game, country);

      return (
        /* jshint ignore:start */
        <CountryComponent
          key={country}
          country={country}
          nearby={nearby}
          selected={selected}
          stream={stream}
        />
        /* jshint ignore:end */
      );
    };
  }

  renderCells(game) {
    return false ? (
      /* jshint ignore:start */
      <PathsComponent className={styles.voronoi} paths={game.world.cells} />
      /* jshint ignore:end */
    ) : null;
  }
}
