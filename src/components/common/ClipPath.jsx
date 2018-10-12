// src/components/common/ClipPath.jsx

import React from 'react'
import PropTypes from 'prop-types'

const ClipPath = ({ x, y, width, height, id }) => (
  <clipPath id={id}>
        <rect x={x} y={y} width={width} height={height} />
  </clipPath>
)

ClipPath.defaultProps = {
  x: 0,
  y: 0
}

ClipPath.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired
}

export default ClipPath
