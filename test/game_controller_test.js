'use strict';

var GameController = require('../src/game_controller'),
    React          = require('react');

describe('GameController', function() {
  var sandbox, controller;

  // Country stubs.
  var a = {}, b = {};

  // Game component stub.
  var gameComponent = {
    setState: function() {}
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
      var setState = sandbox.stub(gameComponent, 'setState');
      controller.selectedCountry(a);
      expect(setState).to.have.been.calledWith({selectedCountry: a});
    });
  });
});
