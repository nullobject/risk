import React from 'react'
import log from '../log'
import styles from '../stylesheets/styles.scss'

export default class ControlsView extends React.PureComponent {
  render () {
    const bus = this.props.bus
    const currentPlayer = this.props.currentPlayer ? this.props.currentPlayer.toString() : ''

    log.debug('ControlsView#render')

    return (
      <div className={styles.controls}>
        <span>{currentPlayer}</span>
        <button type='button' onClick={() => bus.emit('end-turn')}>End Turn</button>
      </div>
    )
  }
}
