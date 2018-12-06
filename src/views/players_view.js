import React from 'react'
import classnames from 'classnames'
import styles from '../../assets/stylesheets/styles.scss'

export default ({ game }) =>
  <ul className={styles.players}>{renderPlayers(game)}</ul>

function renderPlayers (game) {
  return game.players.map((player, index) => {
    const armies = game.armiesForPlayer(player)
    const selected = player === game.currentPlayer
    const disabled = armies === 0
    const className = classnames(styles[player], { [styles.selected]: selected, [styles.disabled]: disabled })

    return <li className={className} key={index}><span>{armies}</span></li>
  })
}
