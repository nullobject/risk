/** @jsx React.DOM */

'use strict';

var core  = require('../core'),
    Bacon = require('baconjs'),
    F     = require('fkit'),
    React = require('react/addons');

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

  classes: function() {
    var player = this.props.country.player,
        color  = player ? player.toString() : '';

    return F.set(color, true, {
      country:  true,
      nearby:   this.props.nearby,
      selected: this.props.selected
    });
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    // Don't update the component if the props haven't changed.
    return nextProps.country !== this.props.country ||
      nextProps.nearby !== this.props.nearby ||
      nextProps.selected !== this.props.selected;
  },

  render: function() {
    var country = this.props.country;

    core.log('CountryComponent#render (' + country + ')');

    return (
      /* jshint ignore:start */
      <g>
        <polygon
          className={cx(this.classes())}
          points={country.polygon}
          onClick={this.didSelectCountry.bind(this, country)}
        />
        {this.renderSlots(country)}
      </g>
      /* jshint ignore:end */
    );
  },

  renderSlots: function(country) {
    return country.slots.map(this.renderSlot(country));
  },

  renderSlot: F.curry(function(country, polygon, index) {
    var classes = {
      selected: index < country.armies,
      slot:     true
    };

    return (
      /* jshint ignore:start */
      <polygon className={cx(classes)} key={index} points={polygon} />
      /* jshint ignore:end */
    );
  }),
});
