/** @jsx React.DOM */

'use strict';

var _     = require('lodash');
var React = require('react/addons');

var cx = React.addons.classSet;

module.exports = React.createClass({
  displayName: 'CountriesComponent',

  getInitialState: function() {
    return {
      selectedCountry: null
    };
  },

  didSelectCountry: function(country) {
    this.props.stream.push(country);
  },

  render: function() {
    var selectedCountry = this.state.selectedCountry;

    var polygons = this.props.countries.map(function(country, index) {
      var color = 'q' + (index % 9) + '-9';

      var classes = {
        cell:     true,
        selected: country === selectedCountry,
        nearby:   selectedCountry && _.contains(selectedCountry.neighbours, country)
      };

      classes[color] = true;

      /* jshint ignore:start */
      return <polygon
        key={index}
        className={cx(classes)}
        points={country.polygon.toString()}
        onClick={this.didSelectCountry.bind(this, country)}
      />;
      /* jshint ignore:end */
    }, this);

    /* jshint ignore:start */
    return <g className={this.props.className}>{polygons}</g>;
    /* jshint ignore:end */
  }
});
