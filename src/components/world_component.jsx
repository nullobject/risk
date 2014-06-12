/** @jsx React.DOM */

'use strict';

var Bacon             = require('baconjs').Bacon,
    CountryComponent  = require('./country_component.jsx'),
    PathsComponent    = require('./paths_component.jsx'),
    PolygonsComponent = require('./polygons_component.jsx'),
    React             = require('react'),
    _                 = require('lodash'),
    core              = require('../core');

module.exports = React.createClass({
  displayName: 'WorldComponent',

  propTypes: {
    stream: React.PropTypes.instanceOf(Bacon.Observable).isRequired,
    world:  React.PropTypes.object.isRequired
  },

  componentWillUpdate: function(nextProps, nextState) {
    var countries       = this.props.world.countries,
        selectedCountry = nextProps.selectedCountry;

    countries.forEach(function(country) {
      this.refs[country].setState({
        selected: country === selectedCountry,
        nearby:   selectedCountry !== null && _.contains(selectedCountry.neighbours, country)
      });
    }, this);
  },

  render: function() {
    var world = this.props.world;

    core.log('WorldComponent#render');

    var polygons = world.countries.map(function(country, index) {
      return (
        /* jshint ignore:start */
        <CountryComponent
          key={country}
          ref={country}
          index={index}
          country={country}
          stream={this.props.stream}
        />
        /* jshint ignore:end */
      );
    }, this);

    return (
      /* jshint ignore:start */
      <g className="world">
        <PolygonsComponent className="hexgrid" polygons={world.hexagons} />
        <g className="countries">{polygons}</g>
        <PathsComponent className="voronoi" paths={world.cells} />
      </g>
      /* jshint ignore:end */
    );
  }
});
