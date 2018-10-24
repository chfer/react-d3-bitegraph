// StatusMarker.jsx

import React from 'react'
import PropTypes from 'prop-types'

const StatusMarker = ({ color, opacity, position, width, height, visible }) => {
  if (!visible) {
    // prevent component from rendering
    return null
  }

  return (
    <rect
      className="statusMarkerRect"
      x={position.x}
      y={position.y}
      width={width}
      height={height}
      stroke="none"
      fill={color}
      fillOpacity={opacity}
      pointerEvents="none" // this is necessary for all mose events to pass through <rect /> />
    />
  )
}

StatusMarker.defaultProps = {
  color: 'black',
  opacity: 0.6
}

StatusMarker.propTypes = {
  color: PropTypes.string,
  opacity: PropTypes.number,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired
}

export default StatusMarker
