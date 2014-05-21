/** @jsx React.DOM */

'use strict';

var React          = require('react');
var WorldComponent = require('./world_component');

module.exports = React.createClass({
  displayName: 'GameComponent',

  // Selects a given country.
  selectCountry: function(country) {
    this.refs.world.setState({selectedCountry: country});
  },

  // Deselects the currently selected country.
  deselectCountry: function() {
    this.selectCountry(null);
  },

  render: function() {
    var game = this.props.game;
    var world = this.props.game.world;

    return (
      /* jshint ignore:start */
      <svg width={game.width} height={game.height}>
        <WorldComponent ref="world" world={world} stream={this.props.stream} />
      </svg>
      /* jshint ignore:end */
    );
  }
});
