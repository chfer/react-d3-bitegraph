// src/components/AnalogBiteGraph/AnalogBiteGraph.jsx

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'

import { measurementDataType } from '../common/DataTypes'

const AnalogStatValues = ({ data, unit, position, valueFormatSpecifier }) => {
  const accessor = d => d.value
  const minimum = d3.min(data, accessor)
  const maximum = d3.max(data, accessor)
  const mean = d3.mean(data, accessor)
  const valueFormat = d3.format(valueFormatSpecifier)
  return (
    <Fragment>
      <text
        className="BiteGraph__AnalogStatlabels"
        textAnchor="end"
        y={position.y}
      >
        <tspan
          className="minimumLabel"
          x={position.x}
          dy="3.4em"
          fontWeight="bold"
        >
          {`Minimum:`}
        </tspan>
        <tspan
          className="maximumLabel"
          x={position.x}
          dy="1.2em"
          fontWeight="bold"
        >
          {`Maximum:`}
        </tspan>
        <tspan
          className="meanLabel"
          x={position.x}
          dy="1.2em"
          fontWeight="bold"
        >
          {`Mean:`}
        </tspan>
      </text>
      <text
        className="BiteGraph__AnalogStatvalues"
        textAnchor="start"
        y={position.y}
      >
        <tspan
          className="minimumValue"
          x={position.x}
          dy="3.4em"
          dx="0.5em"
        >{`${valueFormat(minimum)} ${unit}`}</tspan>

        <tspan className="maximumValue" x={position.x} dy="1.2em" dx="0.5em">
          {`${valueFormat(maximum)} ${unit}`}
        </tspan>

        <tspan className="maximumValue" x={position.x} dy="1.2em" dx="0.5em">
          {`${valueFormat(mean)} ${unit}`}
        </tspan>
      </text>
    </Fragment>
  )
}

AnalogStatValues.defaultProps = {
  valueFormatSpecifier: '.1f',
  unit: ''
}

AnalogStatValues.propTypes = {
  data: PropTypes.arrayOf(measurementDataType).isRequired,
  position: PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  unit: PropTypes.string,
  valueFormatSpecifier: PropTypes.string
}

export default AnalogStatValues
