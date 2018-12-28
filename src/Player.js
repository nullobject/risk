export default class Player {
  constructor (id, human) {
    this.id = id
    this.human = human
  }

  toString () {
    return 'player-' + this.id
  }
}
