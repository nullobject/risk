import * as core from '../core';
import React from 'react';
import classnames from 'classnames'
import styles from '../styles.scss'

export default class CountryComponent extends React.PureComponent {
  didSelectCountry(country) {
    this.props.stream.push({type: 'select-country', country: country});
  }

  render() {
    const country = this.props.country;
    const className = classnames(
      styles[country.player],
      styles.country,
      {
        [styles.nearby]: this.props.nearby,
        [styles.selected]: this.props.selected
      }
    )

    core.log('CountryComponent#render (' + country + ')');

    return (
      /* jshint ignore:start */
      <g>
        <polygon
          className={className}
          points={country.polygon}
          onClick={this.didSelectCountry.bind(this, country)}
        />
        {this.renderSlots(country)}
      </g>
      /* jshint ignore:end */
    );
  }

  renderSlots(country) {
    return country.slots.map(this.renderSlot(country));
  }

  renderSlot(country) {
    return (polygon, index) => {
      const classes = classnames(styles.slot, {[styles.selected]: index < country.armies});

      return (
        /* jshint ignore:start */
        <polygon className={classnames(classes)} key={index} points={polygon} />
        /* jshint ignore:end */
      );
    };
  }
}
