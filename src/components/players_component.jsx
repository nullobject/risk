/** @jsx React.DOM */

'use strict';

var React = require('react/addons'),
    core  = require('../core');

var cx = React.addons.classSet;

module.exports = React.createClass({
  displayName: 'PlayersComponent',

  propTypes: {
    currentPlayer: React.PropTypes.object,
    game:          React.PropTypes.object.isRequired
  },

  classes: function(player) {
    var selected = player === this.props.currentPlayer,
        classes  = {selected: selected};

    classes[player] = true;

    return classes;
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // Don't update the component if the props haven't changed.
    return nextProps.currentPlayer !== this.props.currentPlayer;
  },

  render: function() {
    var game = this.props.game;

    var players = game.players.map(function(player, index) {
      return (
        /* jshint ignore:start */
        <li className={cx(this.classes(player))} key={index}>{game.armiesForPlayer(player)}</li>
        /* jshint ignore:end */
      );
    }, this);

    core.log('PlayersComponent#render');

    return (
      /* jshint ignore:start */
      <ul className="players">{players}</ul>
      /* jshint ignore:end */
    );
  }
});
