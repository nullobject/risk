/** @jsx React.DOM */

'use strict';

var React = require('react'),
    core  = require('../core');

module.exports = React.createClass({
  displayName: 'PlayersComponent',

  propTypes: {
    game: React.PropTypes.object.isRequired
  },

  render: function() {
    var game = this.props.game;

    core.log('PlayersComponent#render');

    var players = game.players.map(function(player, index) {
      return (
        /* jshint ignore:start */
        <li key={index} className={player}>{game.armies(player)}</li>
        /* jshint ignore:end */
      );
    });

    return (
      /* jshint ignore:start */
      <ul className="players">{players}</ul>
      /* jshint ignore:end */
    );
  }
});
