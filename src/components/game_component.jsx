'use strict';

var core  = require('../core'),
    Bacon = require('baconjs'),
    F     = require('fkit'),
    React = require('react');

var CountryComponent = require('./country_component'),
    PathsComponent   = require('./paths_component');

function isNearby(game, country) { return game.canMoveToCountry(country); }
function isSelected(game, country) { return country === game.selectedCountry; }

module.exports = React.createClass({
  displayName: 'GameComponent',

  propTypes: {
    stream: React.PropTypes.instanceOf(Bacon.Observable).isRequired,
    game:   React.PropTypes.object.isRequired
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.game !== this.props.game;
  },

  render: function() {
    var stream = this.props.stream,
        game   = this.props.game;

    core.log('GameComponent#render');

    return (
      /* jshint ignore:start */
      <g className="world">
        <g className="countries">{this.renderCountries(stream, game)}</g>
        {this.renderCells(game)}
      </g>
      /* jshint ignore:end */
    );
  },

  renderCountries: function(stream, game) {
    return game.world.countries.map(this.renderCountry(stream, game));
  },

  renderCountry: F.curry(function(stream, game, country) {
    var nearby   = isNearby(game, country),
        selected = isSelected(game, country);

    return (
      /* jshint ignore:start */
      <CountryComponent
        key={country}
        country={country}
        nearby={nearby}
        selected={selected}
        stream={stream}
      />
      /* jshint ignore:end */
    );
  }),

  renderCells: function(game) {
    return DEVELOPMENT ? (
      /* jshint ignore:start */
      <PathsComponent className="voronoi" paths={game.world.cells} />
      /* jshint ignore:end */
    ) : null;
  },
});
