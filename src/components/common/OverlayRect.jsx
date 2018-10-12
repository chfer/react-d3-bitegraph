// OverlayRect.jsx

import React from 'react'
import PropTypes from 'prop-types'

export default class OverlayRect extends React.Component {
  render() {
    const { width, height } = this.props
    return (
      <rect
        className="overlayRect"
        fill="none"
        stroke="none"
        pointerEvents="all"
        x="0"
        y="0"
        width={width}
        height={height}
        ref="rect"
      />
    )
  }
}

OverlayRect.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
}
