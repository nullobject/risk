/** @jsx React.DOM */

'use strict';

var Bacon = require('baconjs').Bacon;
var React = require('react/addons');
var _     = require('lodash');
var core  = require('../core');

var cx = React.addons.classSet;

module.exports = React.createClass({
  displayName: 'CountryComponent',

  propTypes: {
    stream: React.PropTypes.instanceOf(Bacon.Observable).isRequired,
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
    var color = this.props.country.player ? 'q' + (this.props.country.player.id % 4) + '-4' : '';

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
