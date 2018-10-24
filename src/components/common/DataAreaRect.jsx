// DataAreaRect.jsx

import React from 'react'
import PropTypes from 'prop-types'

export default class DataAreaRect extends React.Component {
  render() {
    const { width, height, dataAreaRectRef } = this.props
    return (
      <rect
        className="dataAreaRect"
        fill="none"
        stroke="none"
        pointerEvents="all"
        x="0"
        y="0"
        width={width}
        height={height}
        ref={el => dataAreaRectRef(el)}
      />
    )
  }
}

DataAreaRect.defaultProps = {
  dataAreaRectRef: () => {}
}

DataAreaRect.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  dataAreaRectRef: PropTypes.func
}
