import React from 'react'
import classnames from 'classnames'
import styles from '../../assets/stylesheets/styles.scss'

export default class CountryView extends React.PureComponent {
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

    return (
      <g>
        <polygon
          className={className}
          points={country.polygon}
          onClick={this.didSelectCountry.bind(this, country)}
        />
        {this.renderSlots(country)}
      </g>
    )
  }

  renderSlots (country) {
    return country.slots.map(this.renderSlot(country))
  }

  renderSlot (country) {
    return (polygon, index) => {
      const classes = classnames(styles.slot, {[styles.selected]: index < country.armies})

      return (
        <polygon className={classnames(classes)} key={index} points={polygon} />
      )
    }
  }
}
