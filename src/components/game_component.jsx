/** @jsx React.DOM */

'use strict';

var core             = require('../core'),
    Bacon            = require('baconjs').Bacon,
    CountryComponent = require('./country_component.jsx'),
    PathsComponent   = require('./paths_component.jsx'),
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

  render: function() {
    var game = this.props.game;

    var countries = game.world.countries.map(function(country) {
      var nearby   = game.canMoveToCountry(country),
          selected = country === game.selectedCountry;

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
    }, this).toArray();

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
