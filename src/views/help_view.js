import React from 'react'
import SocialView from './social_view'
import styles from '../../assets/stylesheets/styles.scss'

export default class HelpView extends React.PureComponent {
  render () {
    const bus = this.props.bus

    return (
      <div className={styles.modal}>
        <div className={styles.container}>
          <h1>Risk</h1>

          <h2>How to Play</h2>

          <p>The game of Risk is played with two or more players on a map. The object of the
          game is for a player to defeat the other players on the map. Players take turns
          advancing their armies or attacking other countries.</p>

          <p>During their turn, a player chooses one of their occupied countries and a
          neighbouring country. If a neighbouring country is occupied then the player
          will attack, otherwise the player will move armies into the unoccupied country.
          A player may only move or attack from an occupied country with two or more
          armies. During a turn a player can move or attack as many times as they wish.</p>

          <p>At the end of their turn, a player is rewarded a number of additional armies.
          They can place these armies in any of their occupied countries.</p>

          <h2>Credits</h2>

          <p>© 2018 Josh Bassett</p>

          <p className={styles.center}><button onClick={() => bus.emit('pause')}>Resume</button></p>

          <footer>
            <SocialView />
          </footer>
        </div>
      </div>
    )
  }
}
