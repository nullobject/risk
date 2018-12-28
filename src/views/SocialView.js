import React from 'react'

import styles from '../../assets/stylesheets/styles.scss'

const TWITTER_URL = 'https://twitter.com/intent/tweet?text=Wanna%20play%20some%20Risk%3F&url=https%3A%2F%2Frisk.joshbassett.info'
const FACEBOOK_URL = 'http://www.facebook.com/sharer.php?u=https%3A%2F%2Frisk.joshbassett.info'
const GITHUB_URL = 'https://github.com/nullobject/risk'

export default () =>
  <nav className={styles.social}>
    <a href={TWITTER_URL} target='_blank'><span className={styles['icon-twitter']} /></a>
    <a href={FACEBOOK_URL} target='_blank'><span className={styles['icon-facebook']} /></a>
    <a href={GITHUB_URL} target='_blank'><span className={styles['icon-github']} /></a>
  </nav>
