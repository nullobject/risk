/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var _     = require('lodash');

var cx = React.addons.classSet;

module.exports = React.createClass({
  displayName: 'CountryComponent',

  didSelectCountry: function(country) {
    this.props.stream.push(country);
  },

  getInitialState: function() {
    return {
      selected: false,
      nearby:   false
    };
  },

  classes: function() {
    var color = 'q' + (this.props.index % 9) + '-9';

    var classes = {
      country:  true,
      selected: this.state.selected,
      nearby:   this.state.nearby
    };

    classes[color] = true;

    return classes;
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // Don't update the component if the state hasn't changed.
    return !_.isEqual(nextState, this.state);
  },

  componentDidUpdate: function() {
    // FIXME: Manually set SVG class. See https://github.com/facebook/react/issues/1139
    this.getDOMNode().setAttribute('class', cx(this.classes()));
  },

  render: function() {
    var country = this.props.country;

    console.log('CountryComponent#render (' + country + ')');

    return (
      /* jshint ignore:start */
      <polygon
        className={cx(this.classes())}
        points={country.polygon}
        onClick={this.didSelectCountry.bind(this, country)}
      />
      /* jshint ignore:end */
    );
  }
});
