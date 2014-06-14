/** @jsx React.DOM */

'use strict';

var Bacon             = require('baconjs').Bacon,
    ControlsComponent = require('./controls_component.jsx'),
    PlayersComponent  = require('./players_component.jsx'),
    React             = require('react'),
    WorldComponent    = require('./world_component.jsx'),
    core              = require('../core');

module.exports = React.createClass({
  displayName: 'GameComponent',

  propTypes: {
    game:   React.PropTypes.object.isRequired,
    stream: React.PropTypes.instanceOf(Bacon.Observable).isRequired
  },

  getInitialState: function() {
    return {
      currentPlayer:   null,
      selectedCountry: null
    };
  },

  render: function() {
    var game  = this.props.game,
        world = game.world;

    core.log('GameComponent#render');

    return (
      /* jshint ignore:start */
      <div className="game">
        <PlayersComponent currentPlayer={this.state.currentPlayer} game={game} />
        <svg width={game.width} height={game.height}>
          <WorldComponent selectedCountry={this.state.selectedCountry} stream={this.props.stream} world={world} />
        </svg>
        <ControlsComponent currentPlayer={this.state.currentPlayer} stream={this.props.stream} />
      </div>
      /* jshint ignore:end */
    );
  }
});
