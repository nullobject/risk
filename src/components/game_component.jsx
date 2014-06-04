/** @jsx React.DOM */

'use strict';

var Bacon          = require('baconjs').Bacon;
var React          = require('react');
var WorldComponent = require('./world_component.jsx');
var core           = require('../core');

module.exports = React.createClass({
  displayName: 'GameComponent',

  propTypes: {
    stream: React.PropTypes.instanceOf(Bacon.Observable).isRequired,
  },

  didEndTurn: function() {
    this.props.stream.push({type: 'end-turn'});
  },

  // Selects a given country.
  selectCountry: function(country) {
    this.refs.world.setState({selectedCountry: country});
  },

  // Deselects the currently selected country.
  deselectCountry: function() {
    this.selectCountry(null);
  },

  render: function() {
    var game  = this.props.game,
        world = game.world;

    core.log('GameComponent#render');

    return (
      /* jshint ignore:start */
      <div>
        <svg width={game.width} height={game.height}>
          <WorldComponent ref="world" world={world} stream={this.props.stream} />
        </svg>
        <nav>
          <a href="#" onClick={this.didEndTurn}>End Turn</a>
        </nav>
      </div>
      /* jshint ignore:end */
    );
  }
});
