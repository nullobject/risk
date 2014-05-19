/** @jsx React.DOM */

var CountriesComponent = require('./countries_component');
var PathsComponent     = require('./paths_component');
var PolygonsComponent  = require('./polygons_component');
var React              = require('react');

module.exports = React.createClass({
  // Selects a given country.
  selectCountry: function(country) {
    this.refs.countries.setState({selectedCountry: country});
  },

  // Deselects the currently selected country.
  deselectCountry: function() {
    this.selectCountry(null);
  },

  render: function() {
    var world = this.props.world;

    return <svg width={world.width} height={world.height}>
      <PolygonsComponent className="hexgrid" polygons={world.hexagons} />
      <CountriesComponent ref="countries" className="PiYG" countries={world.countries} stream={this.props.stream} />
      <PathsComponent className="voronoi" paths={world.cells} />
    </svg>;
  }
});
