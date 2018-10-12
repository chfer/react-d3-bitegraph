// DataAxis.jsx

import React from 'react'
import * as d3 from 'd3'

export default class DataAxis extends React.Component {

  componentDidMount () {
    this.renderAxis()
  }

  componentDidUpdate () {
    this.renderAxis()
  }

  renderAxis () {
    let d3Axis = d3.axisLeft(this.props.scale)
    d3.select(this.refs.axisData).call(d3Axis)
  }

  render () {
    return (
      <g className="axis data" ref="axisData">
      </g>
    )
  }
}
