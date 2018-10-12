// AnalogDataLayer.jsx

import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

import './AnalogDataLayer.css'
import { measurementDataType } from '../common/DataTypes'

export default class AnalogDataLayer extends React.Component {
  componentDidMount() {
    this.renderLine()
  }

  componentDidUpdate() {
    this.renderLine()
  }

  renderLine() {
    let { timeScale, dataScale, data, transition } = this.props
    // console.log(JSON.stringify(data))
    let dataPath = d3
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
    const { clipPathId } = this.props
    return (
      <g className="dataLayer analog">
        <path
          ref="dataPath"
          clipPath={clipPathId ? `url(#${clipPathId})` : ''}
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
