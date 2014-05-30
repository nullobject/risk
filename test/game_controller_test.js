'use strict';

var GameController = require('../src/game_controller');
var React          = require('react');

describe('GameController', function() {
  var sandbox, controller;

  // Country stubs.
  var a = {}, b = {};

  // Game component stub.
  var gameComponent = {
    selectCountry:   function() {},
    deselectCountry: function() {},
    attack:          function() {},
    move:            function() {}
  };

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(React, 'renderComponent').returns(gameComponent);
    controller = new GameController({width: 800, height: 600});
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('#selectCountry', function() {
    it('should call #selectCountry on the component', function() {
      var selectCountry = sandbox.stub(gameComponent, 'selectCountry');
      controller.selectCountry(a);
      expect(selectCountry).to.have.been.calledWith(a);
    });
  });

  describe('#deselectCountry', function() {
    it('should call #deselectCountry on the component', function() {
      var deselectCountry = sandbox.stub(gameComponent, 'deselectCountry');
      controller.deselectCountry(a);
      expect(deselectCountry).to.have.been.called;
    });
  });
});
