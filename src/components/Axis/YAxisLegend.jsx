// YAxisLegend.jsx

import React from 'react'
import './YAxisLegend.css'

export default class YAxisLegend extends React.Component {
  render () {
    return (
      <text className="legend yAxis" transform="rotate(-90)" y={this.props.y} dy={this.props.dy} >{this.props.text}</text>
    )
  }
}
