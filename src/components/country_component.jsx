/** @jsx React.DOM */

'use strict';

var Bacon = require('baconjs').Bacon,
    React = require('react/addons'),
    _     = require('lodash'),
    core  = require('../core');

var cx = React.addons.classSet;

module.exports = React.createClass({
  displayName: 'CountryComponent',

  propTypes: {
    country:  React.PropTypes.object.isRequired,
    nearby:   React.PropTypes.bool.isRequired,
    selected: React.PropTypes.bool.isRequired,
    stream:   React.PropTypes.instanceOf(Bacon.Observable).isRequired
  },

  didSelectCountry: function(country) {
    this.props.stream.push({type: 'select-country', country: country});
  },

  getInitialState: function() {
    return {
      selected: false,
      nearby:   false
    };
  },

  classes: function() {
    var player = this.props.country.player,
        color  = player ? player.toString() : '';

    var classes = {
      country:  true,
      selected: this.props.selected,
      nearby:   this.props.nearby
    };

    classes[color] = true;

    return classes;
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // Don't update the component if the props haven't changed.
    return !_.isEqual(nextProps, this.props);
  },

  componentDidUpdate: function() {
    // FIXME: Manually set SVG class. See https://github.com/facebook/react/pull/1264
    this.getDOMNode().setAttribute('class', cx(this.classes()));
  },

  render: function() {
    var country = this.props.country;

    core.log('CountryComponent#render (' + country + ')');

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
