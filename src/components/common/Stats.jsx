// src/components/common/Stats.jsx

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'

import { measurementDataType, statusDataType } from '../common/DataTypes'

// Define bisector functions for the Time
const bisectTimeLeft = d3.bisector(entry => entry.time).left
const bisectTimeRight = d3.bisector(entry => entry.time).right

const Stats = ({
  data,
  dataWidth,
  timeScale,
  position,
  renderStatValues,
  layout,
  timeFormatSpecifier
}) => {
  const timeFormat = d3.utcFormat(timeFormatSpecifier)
  const [timeScaleStart, timeScaleEnd] = [
    timeScale.invert(0),
    timeScale.invert(dataWidth)
  ]
  // define a clamp function for the data index
  const clamp = index =>
    index === data.length - 1
      ? data.length - 1
      : Math.min(Math.max(0, index), data.length - 1)
  // determine start and end index of the timeScale
  const [indexStart, indexEnd] = [
    clamp(bisectTimeRight(data, timeScaleStart)),
    clamp(bisectTimeRight(data, timeScaleEnd) - 1)
  ]
  // console.log(`indexStart: ${indexStart} indexEnd: ${indexEnd}`)
  const scaledData = data.slice(indexStart, indexEnd + 1)
  const [timeStart, timeEnd] = [data[indexStart].time, data[indexEnd].time]
  return (
    <Fragment>
      <g className="BiteGraph__Stats" style={{ fontSize: layout.fontSize }}>
        <text
          className="BiteGraph__StatTimelabels"
          textAnchor="end"
          y={position.y}
        >
          <tspan
            className="timeFrom"
            x={position.x}
            dy="1.0em"
            fontWeight="bold"
          >
            {`From:`}
          </tspan>
          <tspan className="timeTo" x={position.x} dy="1.2em" fontWeight="bold">
            {`To:`}
          </tspan>
        </text>
        <text
          className="BiteGraph__StatTimevalues"
          textAnchor="start"
          y={position.y}
        >
          <tspan
            className="timeFrom"
            x={position.x}
            dy="1.0em"
            dx="0.5em"
          >{`${timeFormat(timeStart)}`}</tspan>

          <tspan className="timeTo" x={position.x} dy="1.2em" dx="0.5em">
            {`${timeFormat(timeEnd)}`}
          </tspan>
        </text>
        {renderStatValues(scaledData, position)}
      </g>
    </Fragment>
  )
}

Stats.defaultProps = {
  layout: {
    fontSize: '0.6rem'
  },
  renderStatValues: () =>
    console.error(
      'Stats.jsx component: Please provide a render function for the Stat Values !!!'
    ),
  position: {
    x: '100%',
    y: 0
  },
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
  renderStatValues: PropTypes.func.isRequired
}

export default Stats
