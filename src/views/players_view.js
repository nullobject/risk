import React from 'react'
import classnames from 'classnames'
import styles from '../../assets/stylesheets/styles.scss'

export default class PlayersView extends React.PureComponent {
  render () {
    let game = this.props.game

    return (
      <ul className={styles.players}>{this.renderPlayers(game)}</ul>
    )
  }

  renderPlayers (game) {
    return game.players.map(this.renderPlayer(game))
  }

  renderPlayer (game) {
    return (player, index) => {
      const armies = game.armiesForPlayer(player)
      const selected = player === this.props.currentPlayer
      const disabled = armies === 0
      const className = classnames(styles[player], {[styles.selected]: selected, [styles.disabled]: disabled})

      return (
        <li className={className} key={index}><span>{armies}</span></li>
      )
    }
  }
}
