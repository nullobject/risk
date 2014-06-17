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
    selectedCountry: React.PropTypes.object,
    stream:          React.PropTypes.instanceOf(Bacon.Observable).isRequired,
    world:           React.PropTypes.object.isRequired
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // Don't update the component if the props haven't changed.
    return !_.isEqual(nextProps, this.props);
  },

  render: function() {
    var world           = this.props.world,
        selectedCountry = this.props.selectedCountry;

    var polygons = world.countries.map(function(country, index) {
      var selected = country === selectedCountry,
          nearby   = selectedCountry !== null && _.contains(selectedCountry.neighbours, country);

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
        <g className="countries">{polygons}</g>
        {voronoi}
      </g>
      /* jshint ignore:end */
    );
  }
});
