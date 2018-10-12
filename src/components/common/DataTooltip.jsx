// DataTooltip.jsx

import React from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'

import './DataTooltip.css'

export default class DataTooltip extends React.Component {
  constructor(props) {
    super(props)

    this.adjustSize = this.adjustSize.bind(this)
  }

  componentDidMount() {
    this.props.visible && this.adjustSize()
  }

  componentDidUpdate() {
    this.props.visible && this.adjustSize()
  }

  adjustSize() {
    const { layout } = this.props
    const tooltipText = d3.select(this.refs.dataTooltipText)
    const bbox = tooltipText.node().getBBox()
    tooltipText.attr(
      'y',
      bbox.height * (-1 - layout.relMarginVert) - layout.yOffset
    )
    tooltipText.selectAll('.line').attr('x', layout.xOffset)
    // draw box around text
    d3.select(this.refs.dataTooltipBox)
      .attr('width', bbox.width * (1 + 2 * layout.relMarginHor))
      .attr('height', bbox.height * (1 + 2 * layout.relMarginVert))
      .attr('x', bbox.width * (-0.5 - layout.relMarginHor) + layout.xOffset)
      .attr('y', bbox.height * (-1 - 2 * layout.relMarginVert) - layout.yOffset)
    // draw arrow beneath dataTooltipBox
    d3.select(this.refs.dataTooltipArrow)
      .attr(
        'd',
        `M 0 ${-layout.yOffset +
          layout.arrowHeight -
          2} l ${-layout.arrowWidth / 2} ${-layout.arrowHeight} h ${
          layout.arrowWidth
        }`
      )
      .attr('stroke', 'none')
  }

  render() {
    const { textLines, position, visible, layout, crossHair } = this.props

    if (!visible) {
      // prevent component from rendering
      return null
    }

    return (
      <g
        className="DataTooltip"
        transform={`translate(${position.x},${position.y})`}
      >
        <rect
          className="box"
          rx={layout.bdrRad}
          ry={layout.bdrRad}
          ref="dataTooltipBox"
        />
        <path className="arrow" ref="dataTooltipArrow" />
        <text
          className="text"
          style={{ fontSize: layout.fontSize, textAnchor: 'middle' }}
          ref="dataTooltipText"
        >
          <tspan className="first line" x="0" dy="1.0em">
            {textLines[0]}
          </tspan>
          <tspan className="second line" x="0" dy="1.2em">
            {textLines[1]}
          </tspan>
        </text>
        <g className="crossHair" style={{ display: crossHair ? null : 'none' }}>
          <line x1="-15" y1="0" x2="15" y2="0" />
          <line x1="0" y1="-15" x2="0" y2="15" />
        </g>
      </g>
    )
  }
}

DataTooltip.defaultProps = {
  layout: {
    fontSize: '8px',
    relMarginHor: 0.05,
    relMarginVert: 0.15,
    xOffset: 0,
    yOffset: 10,
    bdrRad: 2,
    arrowWidth: 10,
    arrowHeight: 7
  },
  crossHair: false
}

DataTooltip.propTypes = {
  textLines: PropTypes.arrayOf(PropTypes.string),
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  layout: PropTypes.shape({
    fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    relMarginHor: PropTypes.number,
    relMarginVert: PropTypes.number,
    xOffset: PropTypes.number,
    yOffset: PropTypes.number,
    bdrRad: PropTypes.number,
    arrowWidth: PropTypes.number,
    arrowHeight: PropTypes.number
  }),
  crossHair: PropTypes.bool
}
