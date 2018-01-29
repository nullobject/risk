import React from 'react'

export default class ButtonView extends React.PureComponent {
  render () {
    const {disabled, onClick} = this.props

    return (
      <button type='button' aria-disabled={disabled} disabled={disabled} onClick={onClick}>{this.props.children}</button>
    )
  }
}
