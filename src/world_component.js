/** @jsx React.DOM */

var _     = require('lodash');
var React = require('react/addons');

var cx = React.addons.classSet;

module.exports = React.createClass({
  didSelectCountry: function(country) {
    this.props.stream.push(country);
  },

  render: function() {
    var world = this.props.world;

    var polygons = world.countries.map(function(country, index) {
      var color = 'q' + (index % 9) + '-9';

      var classes = {
        cell:     true,
        selected: country === world.selectedCountry,
        nearby:   world.selectedCountry && _.contains(world.selectedCountry.neighbours, country)
      };

      classes[color] = true;

      return <polygon
        className={cx(classes)}
        key={index}
        points={country.polygon.toString()}
        onClick={this.didSelectCountry.bind(this, country)}
      />;
    }, this);

    return <g className={this.props.className}>{polygons}</g>;
  }
});
