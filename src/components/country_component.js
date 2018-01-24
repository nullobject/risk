import React from 'react'
import classnames from 'classnames'
import log from '../log'
import styles from '../stylesheets/styles.scss'

export default class CountryComponent extends React.PureComponent {
  didSelectCountry (country) {
    this.props.bus.emit('select-country', {country})
  }

  render () {
    const country = this.props.country
    const className = classnames(
      styles[country.player],
      styles.country,
      {
        [styles.nearby]: this.props.nearby,
        [styles.selected]: this.props.selected
      }
    )

    log.debug('CountryComponent#render (' + country + ')')

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
    )
  }

  renderSlots (country) {
    return country.slots.map(this.renderSlot(country))
  }

  renderSlot (country) {
    return (polygon, index) => {
      const classes = classnames(styles.slot, {[styles.selected]: index < country.armies})

      return (
        /* jshint ignore:start */
        <polygon className={classnames(classes)} key={index} points={polygon} />
        /* jshint ignore:end */
      )
    }
  }
}
