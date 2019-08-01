import React from 'react'
import styles from './Bio.module.css'
import { getGravatarURL } from '../utils/getGravatarURL'

function Bio(props) {
  let photoURL = getGravatarURL({
    email: "rrmhearts@gmail.com",
    size: 56,
  })

  return (
    <div className={`
      ${styles.Bio}
      ${props.className || ''}
    `}>
      <img src={photoURL} alt="Me" />
      <p>
        Twitter: {' '}
        <a href="https://twitter.com/rrmhearts/">Ryan McCoppin</a>.
        <br />
        On theology, science, and politics<br />
      </p>
    </div>
  )
}

export default Bio
