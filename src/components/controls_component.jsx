import * as core from '../core';
import * as Bacon from 'baconjs';
import * as React from 'react';

export default React.createClass({
  displayName: 'ControlsComponent',

  propTypes: {
    currentPlayer: React.PropTypes.object,
    stream:        React.PropTypes.instanceOf(Bacon.Observable).isRequired
  },

  didEndTurn() {
    this.props.stream.push({type: 'end-turn'});
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.currentPlayer !== this.props.currentPlayer;
  },

  render() {
    let currentPlayer = this.props.currentPlayer ? this.props.currentPlayer.toString() : '';

    core.log('ControlsComponent#render');

    return (
      /* jshint ignore:start */
      <div className="controls">
        <span>{currentPlayer}</span>
        <button type="button" onClick={this.didEndTurn}>End Turn</button>
      </div>
      /* jshint ignore:end */
    );
  },
});
