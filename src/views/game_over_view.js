import React from 'react'
import classnames from 'classnames'

import ButtonView from './button_view'
import SocialView from './social_view'
import styles from '../../assets/stylesheets/styles.scss'

export default ({ bus, win }) =>
  <div className={classnames(styles.modal, styles.row)}>
    <div className={classnames(styles.container, styles['align-self-center'])}>
      <h1>{win ? 'You Win' : 'You Lose'}</h1>
      <footer>
        <ButtonView onClick={() => bus.emit('restart')}>Play Again</ButtonView>
        <SocialView />
      </footer>
    </div>
  </div>
