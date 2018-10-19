// src/components/DiscreteBiteGraph/DiscreteBiteGraph.jsx

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import * as R from 'ramda'

import { statusDataType } from '../common/DataTypes'

const countOccurences = (result, status) => {
  if (result[status]) {
    result[status] += 1
  } else {
    result[status] = 1
  }
  return result
}
const initStatusOccurences = R.compose(
  R.mergeAll,
  R.map(R.objOf(R.__, 0))
)

const getStatusOccurences = (data, domain) =>
  R.compose(
    R.reduce(countOccurences, initStatusOccurences(domain)),
    R.map(R.prop('value'))
  )(data)

const DiscreteStatValues = ({ data, domain, position }) => {
  const statusOccurences = getStatusOccurences(data, domain)
  return (
    <Fragment>
      <text
        className="BiteGraph__DiscreteStatlabels"
        textAnchor="end"
        y={position.y}
      >
        {domain.map((value, index) => (
          <tspan
            key={`${value}-label`}
            className="statsStatusLabel"
            x={position.x}
            dy={index === 0 ? '3.4em' : '1.2em'}
            fontWeight="bold"
          >
            {`${value}:`}
          </tspan>
        ))}
      </text>
      <text
        className="BiteGraph__DiscreteStatoccurences"
        textAnchor="start"
        y={position.y}
      >
        {domain.map((value, index) => (
          <tspan
            key={`${value}-occurence`}
            className="statsStatusOccurence"
            x={position.x}
            dy={index === 0 ? '3.4em' : '1.2em'}
            dx="0.5em"
          >{`${statusOccurences[value]}`}</tspan>
        ))}
      </text>
    </Fragment>
  )
}

DiscreteStatValues.propTypes = {
  data: PropTypes.arrayOf(statusDataType).isRequired,
  domain: PropTypes.arrayOf(PropTypes.string).isRequired,
  position: PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
}

export default DiscreteStatValues
