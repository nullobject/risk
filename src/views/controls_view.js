import ButtonView from './button_view'
import React from 'react'
import styles from '../../assets/stylesheets/styles.scss'

export default ({bus, currentPlayer}) => {
  const text = currentPlayer ? `It's ${currentPlayer}'s turn.` : ''

  return (
    <div className={styles.controls}>
      <span>{text}</span>
      <ButtonView
        disabled={currentPlayer && !currentPlayer.human}
        onClick={() => bus.emit('end-turn')}
      >End Turn</ButtonView>
    </div>
  )
}
