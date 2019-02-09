import React from 'react'
import classnames from 'classnames'

import styles from '../../assets/stylesheets/styles.scss'

export default ({ bus, country, enabled, nearby, selected }) => {
  const className = classnames(
    styles[country.player],
    styles.country,
    {
      [styles.enabled]: enabled,
      [styles.nearby]: nearby,
      [styles.selected]: selected
    }
  )

  return (
    <g>
      <polygon
        className={className}
        points={country.polygon}
        onClick={() => bus.next({ type: 'select-country', country })}
      />
      {renderSlots(country)}
    </g>
  )
}

function renderSlots (country) {
  return country.slots.map((polygon, index) => {
    const classes = classnames(styles.slot, { [styles.selected]: index < country.armies })
    return <polygon className={classnames(classes)} key={index} points={polygon} />
  })
}
