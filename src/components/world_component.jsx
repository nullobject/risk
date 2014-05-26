/** @jsx React.DOM */

'use strict';

var CountryComponent  = require('./country_component.jsx');
var PathsComponent    = require('./paths_component.jsx');
var PolygonsComponent = require('./polygons_component.jsx');
var React             = require('react');
var _                 = require('lodash');

module.exports = React.createClass({
  displayName: 'WorldComponent',

  getInitialState: function() {
    return {
      selectedCountry: null
    };
  },

  componentWillUpdate: function(nextProps, nextState) {
    var countries = this.props.world.countries;
    var selectedCountry = nextState.selectedCountry;

    countries.forEach(function(country) {
      this.refs[country].setState({
        selected: country === selectedCountry,
        nearby: selectedCountry !== null && _.contains(selectedCountry.neighbours, country)
      });
    }, this);
  },

  render: function() {
    console.log('WorldComponent#render');

    var world = this.props.world;

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
      <g>
        <PolygonsComponent className="hexgrid" polygons={world.hexagons} />
        <g className="countries PRGn">{polygons}</g>
        <PathsComponent className="voronoi" paths={world.cells} />
      </g>
      /* jshint ignore:end */
    );
  }
});
