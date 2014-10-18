/** @jsx React.DOM */

'use strict';

var core  = require('../core'),
    F     = require('fkit'),
    React = require('react/addons');

var cx = React.addons.classSet;

module.exports = React.createClass({
  displayName: 'PlayersComponent',

  propTypes: {
    currentPlayer: React.PropTypes.object,
    game:          React.PropTypes.object.isRequired
  },

  classes: function(player) {
    var selected = player === this.props.currentPlayer;
    return F.set(player, true, {selected: selected});
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.currentPlayer !== this.props.currentPlayer ||
      nextProps.game.world !== this.props.game.world;
  },

  render: function() {
    var game = this.props.game;

    core.log('PlayersComponent#render');

    return (
      /* jshint ignore:start */
      <ul className="players">{this.renderPlayers(game)}</ul>
      /* jshint ignore:end */
    );
  },

  renderPlayers: function(game) {
    return game.players.map(this.renderPlayer(this.classes, game));
  },

  renderPlayer: F.curry(function(classes, game, player, index) {
    return (
      /* jshint ignore:start */
      <li className={cx(classes(player))} key={index}>{game.armiesForPlayer(player)}</li>
      /* jshint ignore:end */
    );
  }),
});
