// TimeAxis.jsx

import React from 'react'
import * as d3 from 'd3'

import './Axis.css'

import timeFormat from './timeFormat'

export default class TimeAxis extends React.Component {
  componentDidMount() {
    this.renderAxis()
  }

  componentDidUpdate() {
    this.renderAxis()
  }

  renderAxis() {
    let d3Axis = d3.axisBottom(this.props.scale).tickFormat(timeFormat)
    d3.select(this.refs.axisTime).call(d3Axis)
  }

  render() {
    return (
      <g
        className="axis time"
        ref="axisTime"
        transform={`translate(0, ${this.props.dataHeight})`}
      />
    )
  }
}

//
// TODO timeAxis.propTypes
//
