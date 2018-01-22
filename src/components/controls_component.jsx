import * as core from '../core';
import Bacon from 'baconjs';
import React from 'react';

export default class ControlsComponent extends React.PureComponent {
  didEndTurn() {
    this.props.stream.push({type: 'end-turn'});
  }

  render() {
    let currentPlayer = this.props.currentPlayer ? this.props.currentPlayer.toString() : '';

    core.log('ControlsComponent#render');

    return (
      /* jshint ignore:start */
      <div className="controls">
        <span>{currentPlayer}</span>
        <button type="button" onClick={this.didEndTurn.bind(this)}>End Turn</button>
      </div>
      /* jshint ignore:end */
    );
  }
}
