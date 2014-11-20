import Game from '../src/game';

describe('Game', () => {
  var sandbox, game;

  // Player stub.
  var player = {};

  // Country stubs.
  var source = {}, target = {};

  // World stub.
  var world = {
    countries:           [source, target],
    assignPlayers:       () => {},
    countriesOccupiedBy: () => {},
    move:                () => {},
    attack:              () => {}
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(world, 'assignPlayers').returns(world);
    sandbox.stub(world, 'countriesOccupiedBy').returns(1);
    game = new Game([player], world);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#moveToCountry', () => {
    beforeEach(() => {
      game.currentPlayer = player;
      game.selectedCountry = source;
    });

    it('should move to the target country if the selected country is unoccupied', () => {
      var newWorld = {};

      var mock = sandbox
        .mock(world)
        .expects('move')
        .withArgs(source, target)
        .once()
        .returns(newWorld);

      var result = game.moveToCountry(target);

      expect(result.selectedCountry).to.be.null;
      expect(result.world).to.equal(newWorld);

      mock.verify();
    });

    it('should attack the target country if the selected country is occupied', () => {
      target.player = {};

      var newWorld = {};

      var mock = sandbox
        .mock(world)
        .expects('attack')
        .withArgs(source, target)
        .once()
        .returns(newWorld);

      var result = game.moveToCountry(target);

      expect(result.selectedCountry).to.be.null;
      expect(result.world).to.equal(newWorld);

      mock.verify();
    });
  });
});
