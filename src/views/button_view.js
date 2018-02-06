import React from 'react'

export default ({children, disabled, onClick}) =>
  <button type='button' aria-disabled={disabled} disabled={disabled} onClick={onClick}>{children}</button>
