import React from 'react'
import log from '../log'
import styles from '../stylesheets/styles.scss'

export default class ControlsComponent extends React.PureComponent {
  didEndTurn () {
    this.props.bus.emit('end-turn')
  }

  render () {
    const currentPlayer = this.props.currentPlayer ? this.props.currentPlayer.toString() : ''

    log.debug('ControlsComponent#render')

    return (
      <div className={styles.controls}>
        <span>{currentPlayer}</span>
        <button type='button' onClick={this.didEndTurn.bind(this)}>End Turn</button>
      </div>
    )
  }
}
