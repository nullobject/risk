import ButtonView from './button_view'
import React from 'react'
import SocialView from './social_view'
import classnames from 'classnames'
import styles from '../../assets/stylesheets/styles.scss'

export default class GameOverView extends React.PureComponent {
  render () {
    const {bus, win} = this.props

    return (
      <div className={classnames(styles.modal, styles.row)}>
        <div className={classnames(styles.container, styles.center, styles['align-self-center'])}>
          <h1>{win ? 'You Win' : 'You Lose'}</h1>
          <ButtonView onClick={() => bus.emit('restart')}>Play Again</ButtonView>
          <footer>
            <SocialView />
          </footer>
        </div>
      </div>
    )
  }
}
