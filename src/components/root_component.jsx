'use strict';

var core  = require('../core'),
    Bacon = require('baconjs'),
    React = require('react');

var ControlsComponent = require('./controls_component'),
    GameComponent     = require('./game_component'),
    HexgridComponent  = require('./hexgrid_component'),
    PlayersComponent  = require('./players_component');

module.exports = React.createClass({
  displayName: 'RootComponent',

  propTypes: {
    game:   React.PropTypes.object.isRequired,
    stream: React.PropTypes.instanceOf(Bacon.Observable).isRequired
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.game !== this.props.game;
  },

  render: function() {
    var stream = this.props.stream,
        game   = this.props.game;

    core.log('RootComponent#render');

    return (
      /* jshint ignore:start */
      <div className="game">
        <PlayersComponent currentPlayer={game.currentPlayer} game={game} />
        <svg width={game.world.width} height={game.world.height}>
          <HexgridComponent width={game.world.width} height={game.world.height} hexgrid={game.world.hexgrid} />
          <GameComponent stream={stream} game={game} />
        </svg>
        <ControlsComponent currentPlayer={game.currentPlayer} stream={stream} />
      </div>
      /* jshint ignore:end */
    );
  },
});
