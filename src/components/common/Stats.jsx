// src/components/common/Stats.jsx

import React, { Component, Fragment, createRef } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import * as R from 'ramda'

import { measurementDataType, statusDataType } from '../common/DataTypes'

// Define bisector functions for the Time
const bisectTimeLeft = d3.bisector(entry => entry.time).left
const bisectTimeRight = d3.bisector(entry => entry.time).right
// define a clamp function for the data index
const clamp = (index, dataCount) => R.clamp(0, dataCount, index)
// determine whether the data is discrete or analog
// if the 'value' of the first element is a 'String' it is considered discrete
const isDiscreteData = R.compose(
  R.equals('String'),
  R.type,
  R.prop('value'),
  R.head
)

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
    const [timeAxisStart, timeAxisEnd] = [
      timeScale.invert(0),
      timeScale.invert(dataWidth)
    ]
    // determine start and end index of the time Axis
    const [indexStart, indexEnd] = [
      clamp(bisectTimeRight(data, timeAxisStart), data.length),
      clamp(bisectTimeRight(data, timeAxisEnd) - 1, data.length)
    ]
    // console.log(`indexStart: ${indexStart} indexEnd: ${indexEnd}`)
    this.scaledData = data.slice(indexStart, indexEnd + 1) // indexEnd must be included => slice to indexEnd + 1
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
