/** @jsx React.DOM */

'use strict';

var Bacon            = require('baconjs').Bacon,
    React            = require('react'),
    PlayersComponent = require('./players_component.jsx'),
    WorldComponent   = require('./world_component.jsx'),
    core             = require('../core');

module.exports = React.createClass({
  displayName: 'GameComponent',

  propTypes: {
    stream: React.PropTypes.instanceOf(Bacon.Observable).isRequired,
  },

  getInitialState: function() {
    return {
      canEndTurn:     true,
      selectedPlayer: null
    };
  },

  didEndTurn: function() {
    this.props.stream.push({type: 'end-turn'});
  },

  // Sets the current player.
  currentPlayer: function(player) {
    this.setState({currentPlayer: player});
  },

  // Sets the selected country.
  selectedCountry: function(country) {
    this.refs.world.setState({selectedCountry: country});
  },

  render: function() {
    var game          = this.props.game,
        world         = game.world,
        currentPlayer = this.state.currentPlayer ? this.state.currentPlayer.toString() : '';

    core.log('GameComponent#render');

    return (
      /* jshint ignore:start */
      <div>
        <PlayersComponent game={game} />
        <svg width={game.width} height={game.height}>
          <WorldComponent ref="world" stream={this.props.stream} world={world} />
        </svg>
        <div>
          <span>{currentPlayer}</span>
          <button type="button" onClick={this.didEndTurn} disabled={!this.state.canEndTurn}>End Turn</button>
        </div>
      </div>
      /* jshint ignore:end */
    );
  }
});
