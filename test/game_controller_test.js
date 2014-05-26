var GameController = require('../src/game_controller');
var React          = require('react');
var expect         = require('chai').expect;
var sinon          = require('sinon');

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
      expect(selectCountry.calledWith(a)).to.be.true
    });
  });

  describe('#deselectCountry', function() {
    it('should call #deselectCountry on the component', function() {
      var deselectCountry = sandbox.stub(gameComponent, 'deselectCountry');
      controller.deselectCountry(a);
      expect(deselectCountry.called).to.be.true
    });
  });

  describe('#move', function() {
    it('should call #deselectCountry on the component', function() {
      var deselectCountry = sandbox.stub(gameComponent, 'deselectCountry'),
          move            = sandbox.stub(controller.game, 'move');

      controller.move(a, b);

      expect(deselectCountry.called).to.be.true
      expect(move.calledWith(a, b)).to.be.true
    });
  });
});
