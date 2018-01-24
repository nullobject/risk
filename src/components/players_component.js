import React from 'react'
import classnames from 'classnames'
import log from '../log'
import styles from '../stylesheets/styles.scss'

export default class PlayersComponent extends React.PureComponent {
  render () {
    let game = this.props.game

    log.debug('PlayersComponent#render')

    return (
      /* jshint ignore:start */
      <ul className={styles.players}>{this.renderPlayers(game)}</ul>
      /* jshint ignore:end */
    )
  }

  renderPlayers (game) {
    return game.players.map(this.renderPlayer(game))
  }

  renderPlayer (game) {
    return (player, index) => {
      const selected = player === this.props.currentPlayer
      const className = classnames(styles[player], {[styles.selected]: selected})

      return (
        /* jshint ignore:start */
        <li className={className} key={index}>{game.armiesForPlayer(player)}</li>
        /* jshint ignore:end */
      )
    }
  }
}
