// DataPointMarker.jsx

import React from 'react'
import PropTypes from 'prop-types'

import './DataPointMarker.css'

const DataPointMarker = ({ radius, position, visible }) => {
  if (!visible) {
    // prevent component from rendering
    return null
  }

  return (
    <circle
      className="datapoint marker"
      r={radius}
      cx={position.x}
      cy={position.y}
      pointerEvents="none" // this is necessary for all mose events to pass through circle />
    />
  )
}

export default DataPointMarker

DataPointMarker.defaultProps = {
  radius: 3
}

DataPointMarker.propTypes = {
  radius: PropTypes.number,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  visible: PropTypes.bool.isRequired
}
