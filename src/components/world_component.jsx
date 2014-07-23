/** @jsx React.DOM */

'use strict';

var Bacon            = require('baconjs').Bacon,
    CountryComponent = require('./country_component.jsx'),
    PathsComponent   = require('./paths_component.jsx'),
    React            = require('react'),
    _                = require('lodash'),
    core             = require('../core');

module.exports = React.createClass({
  displayName: 'WorldComponent',

  propTypes: {
    currentPlayer:   React.PropTypes.object,
    selectedCountry: React.PropTypes.object,
    stream:          React.PropTypes.instanceOf(Bacon.Observable).isRequired,
    game:            React.PropTypes.object.isRequired,
    world:           React.PropTypes.object.isRequired
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // Don't update the component if the props haven't changed.
    return !_.isEqual(nextProps, this.props);
  },

  render: function() {
    var world           = this.props.world,
        game            = this.props.game,
        currentPlayer   = this.props.currentPlayer,
        selectedCountry = this.props.selectedCountry;

    var countries = world.countries.map(function(country, index) {
      var selected = country === selectedCountry,
          nearby   = selectedCountry !== null && game.canMove(currentPlayer, selectedCountry, country);

      return (
        /* jshint ignore:start */
        <CountryComponent
          key={country}
          country={country}
          stream={this.props.stream}
          selected={selected}
          nearby={nearby}
        />
        /* jshint ignore:end */
      );
    }, this);

    var voronoi = this.props.debug ? <PathsComponent className="voronoi" paths={world.cells} /> : '';

    core.log('WorldComponent#render');

    return (
      /* jshint ignore:start */
      <g className="world">
        <g className="countries">{countries}</g>
        {voronoi}
      </g>
      /* jshint ignore:end */
    );
  }
});
