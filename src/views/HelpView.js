import React from 'react'

import SocialView from './SocialView'
import styles from '../../assets/stylesheets/styles.scss'

export default ({ bus }) =>
  <div className={styles.modal} onClick={() => bus.emit('pause')}>
    <div className={styles.container}>
      <h1>Risk</h1>

      <h2>How to Play</h2>

      <p>The game of Risk is played on a map divided up into countries. You
      control the blue player, the other players are all controlled by the computer.
      The players all take turns advancing their armies and attacking other
      countries. The object of the game is to defeat all the other players on the
      map.</p>

      <p>During their turn, a player selects one of their occupied countries
      and a neighbouring country. If the neighbouring country is already occupied by
      another player, then the player will attack. Otherwise the player will immediately move
      their armies into the unoccupied territory. During their turn, a player can move or attack as many times as they wish.</p>

      <p>A player may only mount an attack from a country that contains at
      least two armies. If they win the battle, then the player moves into the new
      territory - although they may lose some armies during the battle. If the
      battle is lost, then the player will lose all of their armies in the attacking
      country.</p>

      <p>At the end of their turn, a player is awarded additional armies. The
      number of additional armies awarded is equal to the size of the largest
      contiguous group of countries occupied by the player. The additional armies are
      automatically distributed amoung the player's countries.</p>

      <h2>Credits</h2>

      <p>Made with love by <a href='https://joshbassett.info'>Josh Bassett</a>, 2018.</p>

      <footer>
        <SocialView />
      </footer>
    </div>
  </div>
