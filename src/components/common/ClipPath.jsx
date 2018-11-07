// src/components/common/ClipPath.jsx

import React from 'react'
import PropTypes from 'prop-types'

// If zoominfg & panning is applied, the clipPath must stay the same
// Normally it will get the same transfrom as the svg element it clips
// So this need to be comensated by an inverse transform
const ClipPath = ({ x, y, width, height, id, zoomTransform }) => (
  <clipPath id={id}>
    <rect x={x} y={y} width={width} height={height} />
  </clipPath>
)

ClipPath.defaultProps = {
  x: 0,
  y: 0
}

ClipPath.propTypes = {
  x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired
}

export default ClipPath
