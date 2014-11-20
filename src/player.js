export default class Player {
  constructor(id) {
    this.id = id;
  }

  toString() {
    return 'player-' + this.id;
  }
}
