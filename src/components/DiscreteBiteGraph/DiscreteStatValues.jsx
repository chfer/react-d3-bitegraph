// src/components/DiscreteBiteGraph/DiscreteBiteGraph.jsx

import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import * as R from 'ramda'

import { statusDataType } from '../common/DataTypes'

const initStatusOccurences = R.compose(
  R.mergeAll,
  R.map(R.objOf(R.__, 0))
)

const countOccurences = (result, status) =>
  R.evolve({ [status]: R.inc })(result)

const getStatusOccurences = (data, domain) =>
  R.compose(
    R.reduce(countOccurences, initStatusOccurences(domain)),
    R.map(R.prop('value'))
  )(data)

const DiscreteStatValues = ({ data, domain, colorScale, position }) => {
  const statusOccurences = getStatusOccurences(data, domain)
  const statusValues = R.tail(domain)
  return (
    <Fragment>
      <text
        className="BiteGraph__DiscreteStatlabels"
        textAnchor="end"
        y={position.y}
      >
        {statusValues.map((value, index) => (
          <Fragment key={`label-${index}`}>
            <tspan
              className="statsStatusLabel"
              fill={colorScale({ value })}
              x={position.x}
              dy={index === 0 ? '4.6em' : '1.2em'}
              fontWeight="bold"
            >
              {`${value}`}
            </tspan>:
          </Fragment>
        ))}
      </text>
      <text
        className="BiteGraph__DiscreteStatoccurences"
        textAnchor="start"
        y={position.y}
      >
        {statusValues.map((value, index) => (
          <tspan
            key={`occurence-${index}`}
            className="statsStatusOccurence"
            x={position.x}
            dy={index === 0 ? '4.6em' : '1.2em'}
            dx="0.5em"
          >{`${statusOccurences[value]}`}</tspan>
        ))}
      </text>
    </Fragment>
  )
}

DiscreteStatValues.defaultProps = {
  colorScale: () => 'black'
}

DiscreteStatValues.propTypes = {
  data: PropTypes.arrayOf(statusDataType).isRequired,
  domain: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorScale: PropTypes.func,
  position: PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
}

export default DiscreteStatValues
