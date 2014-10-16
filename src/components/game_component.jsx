/** @jsx React.DOM */

'use strict';

var core             = require('../core'),
    Bacon            = require('baconjs'),
    CountryComponent = require('./country_component'),
    PathsComponent   = require('./paths_component'),
    React            = require('react');

module.exports = React.createClass({
  displayName: 'GameComponent',

  propTypes: {
    debug:  React.PropTypes.bool,
    game:   React.PropTypes.object.isRequired,
    stream: React.PropTypes.instanceOf(Bacon.Observable).isRequired
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // Don't update the component if the props haven't changed.
    return nextProps.game !== this.props.game;
  },

  renderCountry: function(country, nearby, selected) {
    return (
      /* jshint ignore:start */
      <CountryComponent
        key={country}
        country={country}
        nearby={nearby}
        selected={selected}
        stream={this.props.stream}
      />
      /* jshint ignore:end */
    );
  },

  render: function() {
    var game = this.props.game;

    var countries = game.world.countries.map(function(country) {
      return this.renderCountry(country, game.canMoveToCountry(country), game.isCountrySelected(country));
    }, this);

    var voronoi = this.props.debug ? <PathsComponent className="voronoi" paths={game.world.cells} /> : '';

    core.log('GameComponent#render');

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
