// src/components/common/Stats.jsx

import React, { Component, Fragment, createRef } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import * as R from 'ramda'

import { getVisibleDataSlice, isDiscreteData } from '../common/helpers'
import { measurementDataType, statusDataType } from '../common/DataTypes'

export default class Stats extends Component {
  constructor(props) {
    super(props)
    this.statsNodeRef = createRef()
    this.updateTimeFormat()
    this.updateDataDomain()
    this.state = {
      statsViewPosition: {
        x: -9999999,
        y: 0
      }
    }
    // console.log('"Stats" component Initialized ...')
  }

  updateTimeFormat() {
    const { timeFormatSpecifier } = this.props
    this.timeFormat = d3.utcFormat(timeFormatSpecifier)
  }

  updateDataDomain() {
    const { data, dataWidth, timeScale } = this.props
    const {
      timeAxisStart,
      indexStart,
      indexEnd,
      visibleData
    } = getVisibleDataSlice(data, dataWidth, timeScale)
    this.scaledData = visibleData
    // if we have a discrete data and the first datapoint is greater than the start of the timescale
    // include the datapoint right before the start of the timescale
    if (
      isDiscreteData(data) &&
      indexStart > 0 &&
      data[indexStart].time.getTime() > timeAxisStart.getTime()
    ) {
      this.timeStart = data[indexStart - 1].time
    } else {
      this.timeStart = data[indexStart].time
    }
    this.timeEnd = data[indexEnd].time
    // console.log(
    //   `timeStart: ${this.timeFormat(this.timeStart)} timeEnd: ${this.timeFormat(
    //     this.timeEnd
    //   )}`
    // )
  }

  componentDidMount() {
    const { dataWidth } = this.props
    if (this.statsNodeRef.current) {
      const bbox = this.statsNodeRef.current.getBBox()
      // console.log(`Stats Node BBox width: ${bbox.width}`)
      // console.log(this.statsNodeRef.current.getBBox())
      // align the stats view bow to the right
      this.setState({
        statsViewPosition: {
          x: dataWidth - bbox.width
        }
      })
    }
    // console.log('"Stats" component Mounted ...')
  }

  render() {
    const { renderStatValues, layout, position } = this.props
    this.updateTimeFormat()
    this.updateDataDomain()
    const { timeFormat, timeStart, timeEnd, scaledData } = this
    // merge position from the props with that from state
    const { x, y } = { ...position, ...this.state.statsViewPosition }

    return (
      <Fragment>
        <g className="BiteGraph__Stats" style={{ fontSize: layout.fontSize }}>
          <text className="BiteGraph__StatTimelabels" textAnchor="end" y={y}>
            <tspan className="timeFrom" x={x} dy="1.0em" fontWeight="bold">
              {`From:`}
            </tspan>
            <tspan className="timeTo" x={x} dy="1.2em" fontWeight="bold">
              {`To:`}
            </tspan>
            <tspan className="timeTo" x={x} dy="1.2em" fontWeight="bold">
              {`Number of datapoints:`}
            </tspan>
          </text>
          <text
            className="BiteGraph__StatTimevalues"
            textAnchor="start"
            y={y}
            ref={this.statsNodeRef}
          >
            <tspan
              className="timeFrom"
              x={x}
              dy="1.0em"
              dx="0.5em"
            >{`${timeFormat(timeStart)}`}</tspan>
            <tspan className="timeTo" x={x} dy="1.2em" dx="0.5em">
              {`${timeFormat(timeEnd)}`}
            </tspan>
            <tspan className="timeTo" x={x} dy="1.2em" dx="0.5em">
              {`${this.scaledData.length}`}
            </tspan>
          </text>
          {renderStatValues(scaledData, { x, y })}
        </g>
      </Fragment>
    )
  }
}

Stats.defaultProps = {
  layout: {
    fontSize: '0.6rem'
  },
  position: {
    y: 0
  },
  renderStatValues: () =>
    console.error(
      'Stats.jsx component: Please provide a render function for the Stat Values !!!'
    ),
  timeFormatSpecifier: '%a %d-%m-%Y %H:%M:%S'
}

Stats.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(measurementDataType),
    PropTypes.arrayOf(statusDataType)
  ]).isRequired,
  dataWidth: PropTypes.number.isRequired,
  timeScale: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  renderStatValues: PropTypes.func.isRequired,
  timeFormatSpecifier: PropTypes.string
}
