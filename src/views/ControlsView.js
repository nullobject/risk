import React from 'react'

import ButtonView from './ButtonView'
import styles from '../../assets/stylesheets/styles.scss'

const PLAYER_NAMES = ['your', "red's", "green's", "purple's", "orange's"]

export default ({ bus, currentPlayer }) => {
  const text = currentPlayer ? `It's ${PLAYER_NAMES[currentPlayer.id]} turn.` : ''

  return (
    <div className={styles.controls}>
      <span>{text}</span>
      <ButtonView
        disabled={currentPlayer && !currentPlayer.human}
        onClick={() => bus.value('end-turn')}
      >End Turn</ButtonView>
    </div>
  )
}
