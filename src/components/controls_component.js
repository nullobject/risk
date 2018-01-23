import * as core from '../core'
import React from 'react'
import styles from '../styles.scss'

export default class ControlsComponent extends React.PureComponent {
  didEndTurn () {
    this.props.stream.push({type: 'end-turn'})
  }

  render () {
    const currentPlayer = this.props.currentPlayer ? this.props.currentPlayer.toString() : ''

    core.log('ControlsComponent#render')

    return (
      /* jshint ignore:start */
      <div className={styles.controls}>
        <span>{currentPlayer}</span>
        <button type='button' onClick={this.didEndTurn.bind(this)}>End Turn</button>
      </div>
      /* jshint ignore:end */
    )
  }
}
