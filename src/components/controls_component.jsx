'use strict';

var core  = require('../core'),
    Bacon = require('baconjs'),
    React = require('react');

module.exports = React.createClass({
  displayName: 'ControlsComponent',

  propTypes: {
    currentPlayer: React.PropTypes.object,
    stream:        React.PropTypes.instanceOf(Bacon.Observable).isRequired
  },

  didEndTurn: function() {
    this.props.stream.push({type: 'end-turn'});
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.currentPlayer !== this.props.currentPlayer;
  },

  render: function() {
    var currentPlayer = this.props.currentPlayer ? this.props.currentPlayer.toString() : '';

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
