import Game from '../src/game';

describe('Game', () => {
  let sandbox, game;

  // Player stub.
  let player = {};

  // Country stubs.
  let source = {}, target = {};

  // World stub.
  let world = {
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
      let newWorld = {};

      let mock = sandbox
        .mock(world)
        .expects('move')
        .withArgs(source, target)
        .once()
        .returns(newWorld);

      let result = game.moveToCountry(target);

      expect(result.selectedCountry).to.be.null;
      expect(result.world).to.equal(newWorld);

      mock.verify();
    });

    it('should attack the target country if the selected country is occupied', () => {
      target.player = {};

      let newWorld = {};

      let mock = sandbox
        .mock(world)
        .expects('attack')
        .withArgs(source, target)
        .once()
        .returns(newWorld);

      let result = game.moveToCountry(target);

      expect(result.selectedCountry).to.be.null;
      expect(result.world).to.equal(newWorld);

      mock.verify();
    });
  });
});
