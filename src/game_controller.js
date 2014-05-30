'use strict';

var Bacon                   = require('baconjs').Bacon;
var CountryStateTransformer = require('./country_state_transformer');
var Game                    = require('./game');
var GameComponent           = require('./components/game_component.jsx');
var React                   = require('react');
var _                       = require('lodash');

// Calls the given function.
function call(fn) {
  fn();
}

function GameController(options) {
  this.game = new Game(options.width, options.height);

  var countryStream = new Bacon.Bus();

  countryStream
    .withStateMachine(null, this.handleEvent.bind(this, this.game, this.game.players[0]))
    .onValue(call);

  this.gameComponent = React.renderComponent(
    GameComponent({game: this.game, stream: countryStream}),
    options.el
  );
}

// Mixin the country state transformer.
_.extend(GameController.prototype, CountryStateTransformer);

GameController.prototype.selectCountry = function(country) {
  console.log('GameController#selectCountry', country);
  this.gameComponent.selectCountry(country);
};

GameController.prototype.deselectCountry = function() {
  console.log('GameController#deselectCountry');
  this.gameComponent.deselectCountry();
};

GameController.prototype.constructor = GameController;

module.exports = GameController;
