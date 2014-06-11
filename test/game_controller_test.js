'use strict';

var GameController = require('../src/game_controller');
var React          = require('react');

describe('GameController', function() {
  var sandbox, controller;

  // Country stubs.
  var a = {}, b = {};

  // Game component stub.
  var gameComponent = {
    currentPlayer:   function() {},
    selectedCountry: function() {}
  };

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(React, 'renderComponent').returns(gameComponent);
    controller = new GameController({width: 800, height: 600});
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#selectedCountry', function() {
    it('should call #selectedCountry on the component', function() {
      var selectedCountry = sandbox.stub(gameComponent, 'selectedCountry');
      controller.selectedCountry(a);
      expect(selectedCountry).to.have.been.calledWith(a);
    });
  });
});
