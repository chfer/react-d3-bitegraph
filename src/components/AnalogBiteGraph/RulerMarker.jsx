// RulerMarker.jsx

import React from 'react'
import PropTypes from 'prop-types'

import './RulerMarker.css'

const RulerMarker = props => {
  const { dataHeight, position, visible } = props

  if (!visible) {
    // prevent component from rendering
    return null
  }

  return (
    <line
      className="ruler marker"
      x1={position.x}
      y1={dataHeight}
      x2={position.x}
      y2={position.y}
      style={{ display: visible ? null : 'none' }}
      pointerEvents="none" // this is necessary for all mose events to pass through the <line />
    />
  )
}

RulerMarker.propTypes = {
  dataHeight: PropTypes.number,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  visible: PropTypes.bool.isRequired
}

export default RulerMarker
