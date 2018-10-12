// DiscreteDataLayer.jsx

import React from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'

import './DiscreteDataLayer.css'
import { statusDataType } from '../common/DataTypes'

export default class DiscreteDataLayer extends React.Component {
  static get lastStatusRectwidth() {
    // Width of the last status rect
    // must be exportable (used in the <StatusMarker /> component)
    return 5
  }

  componentDidMount() {
    this.renderStatusData()
  }

  componentDidUpdate() {
    this.renderStatusData()
  }

  renderStatusData() {
    let { timeScale, dataScale, data, baseVal, transition } = this.props

    // Any existing rects (that are descendants of this.refs.discreteDataLayer) are selected.
    // These rects are joined to new data, returning the matching rects: the update selection.
    let statusRect = d3
      .select(this.refs.discreteDataLayer)
      .selectAll('rect')
      .data(data)
    // Detect rendering for the first time
    let firstRender = statusRect.empty()

    // Any existing rects that do not match new dataâthe exit selectionâare removed.
    statusRect.exit().remove()

    // New rects are appended for any new data that do not match any existing rect: the enter selection.
    let mergedStatusRect = statusRect
      .enter()
      .append('rect')
      .merge(statusRect) // A new selection representing the union of entering and updating rects is created
    if (!firstRender && transition) {
      // Avoid a transition on the first render, gives an ugly glitch glitch
      mergedStatusRect = mergedStatusRect.transition()
    }
    mergedStatusRect
      .attr('class', entry => `status ${entry.value}`)
      .attr('x', entry => timeScale(entry.time))
      .attr('y', entry => dataScale(entry.value))
      .attr('width', (entry, index) => {
        if (index < data.length - 1) {
          return timeScale(data[index + 1].time) - timeScale(entry.time)
        } else {
          return DiscreteDataLayer.lastStatusRectwidth
        }
      })
      .attr('height', entry => dataScale(baseVal) - dataScale(entry.value))
  }

  render() {
    const { clipPathId } = this.props
    return (
      <g
        className="dataLayer discrete"
        ref="discreteDataLayer"
        clipPath={clipPathId ? `url(#${clipPathId})` : ''}
      />
    )
  }
}

DiscreteDataLayer.defaultProps = {
  transition: true
}

DiscreteDataLayer.propTypes = {
  timeScale: PropTypes.func.isRequired,
  dataScale: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(statusDataType).isRequired,
  valueColors: PropTypes.objectOf(PropTypes.string).isRequired,
  baseVal: PropTypes.string.isRequired,
  transition: PropTypes.bool,
  clipPathId: PropTypes.string
}
