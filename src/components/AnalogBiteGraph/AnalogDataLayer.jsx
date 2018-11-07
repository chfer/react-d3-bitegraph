// AnalogDataLayer.jsx

import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import './AnalogDataLayer.css'
import { measurementDataType } from '../common/DataTypes'
import { getVisibleDataSlice } from '../common/helpers'

export default class AnalogDataLayer extends React.Component {
  componentDidMount() {
    this.renderLine()
    console.log('Mounted AnalogDataLayer ...')
  }

  componentDidUpdate(prevProps, prevState) {
    this.renderLine()
    console.log('Updated AnalogDataLayer ...')
  }

  scaleData(data) {
    const { timeScale, dataScale } = this.props
    return data.map(entry => ({
      x: timeScale(entry.time),
      y: dataScale(entry.value)
    }))
  }

  renderLine() {
    const { timeScale, data, dataScale, transition } = this.props

    const dataPath = d3
      .line()
      .x(entry => timeScale(entry.time))
      .y(entry => dataScale(entry.value))
    let dataPathRef = d3.select(this.refs.dataPath)
    if (transition) {
      dataPathRef = dataPathRef.transition().duration(500)
    }
    dataPathRef.attr('d', dataPath(data))
  }

  render() {
    // console.log(`Rendering Analog dataLayer ...`)
    // console.time('AnalogDataLayer')
    const { clipPathId } = this.props
    return (
      <g className="dataLayer analog">
        <path
          ref="dataPath"
          clipPath={clipPathId ? `url(#${clipPathId})` : ''}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          pointerEvents="none" // this is necessary for all mouse events to pass through the stroke of the datalayer <path />
        />
      </g>
    )
  }
}

AnalogDataLayer.defaultProps = {
  transition: true
}

AnalogDataLayer.propTypes = {
  timeScale: PropTypes.func.isRequired,
  dataScale: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(measurementDataType).isRequired,
  transition: PropTypes.bool,
  clipPathId: PropTypes.string
}
