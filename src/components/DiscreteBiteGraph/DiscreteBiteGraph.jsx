// src/components/DiscreteBiteGraph/DiscreteBiteGraph.jsx

import React from 'react'
import PropTypes from 'prop-types'

import { createTimeScale, createDiscreteScale } from '../common/biteGraphScales'
import ClipPath from '../common/ClipPath.jsx'
import TimeAxis from '../Axis/TimeAxis.jsx'
import DataAxis from '../Axis/DataAxis.jsx'
import YAxisLegend from '../Axis/YAxisLegend.jsx'
import DiscreteDataLayer from './DiscreteDataLayer.jsx'
import DiscreteDataReader from './DiscreteDataReader.jsx'
import { statusDataType } from '../common/DataTypes'
import { styles, dataHeight, dataWidth } from '../common/biteGraphStyles'

import { withZoom } from '../common/Zoomable.jsx'

export function DiscreteBiteGraph(props) {
  const {
    data,
    colorScale,
    domain,
    zoomTransform,
    dataReader,
    transition,
    svgRef
  } = props
  const {
    width,
    height,
    padding: {
      left: paddingLeft,
      right: paddingRight,
      top: paddingTop,
      bottom: paddingBottom
    }
  } = styles
  const initialTimeScale = createTimeScale(data, dataWidth)
  const dataScale = createDiscreteScale(domain, dataHeight)
  // apply a zoom transform to the timescale if present
  const timeScale = zoomTransform
    ? zoomTransform.rescaleX(initialTimeScale)
    : initialTimeScale

  return (
    <svg
      className="BiteGraph analog"
      width="100%"
      height="100%"
      viewBox={`-${paddingLeft} -${paddingTop} ${width} ${height}`}
      ref={svgRef}
    >
      <ClipPath
        width={dataWidth}
        height={dataHeight}
        id="BiteGraph-discrete-clippath"
      />
      <TimeAxis scale={timeScale} dataHeight={dataHeight} />
      <DataAxis scale={dataScale} />
      <YAxisLegend y={-paddingLeft} dy="1.5em" text="Status Random Data" />
      <DiscreteDataLayer
        timeScale={timeScale}
        dataScale={dataScale}
        data={data}
        colorScale={colorScale}
        baseVal={domain[0]}
        transition={transition}
        clipPathId="BiteGraph-discrete-clippath"
      />
      {dataReader && (
        <DiscreteDataReader
          timeScale={timeScale}
          dataScale={dataScale}
          data={data}
          dataWidth={dataWidth}
          dataHeight={dataHeight}
        />
      )}
    </svg>
  )
}

DiscreteBiteGraph.defaultProps = {
  colorScale: () => '#007bff',
  zoomTransform: null,
  dataReader: true,
  transition: true,
  svgRef: () => {}
}

DiscreteBiteGraph.propTypes = {
  data: PropTypes.arrayOf(statusDataType).isRequired,
  domain: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorScale: PropTypes.func,
  zoomTransform: PropTypes.object, //d3 zoom transform object
  dataReader: PropTypes.bool,
  transition: PropTypes.bool,
  svgRef: PropTypes.func // used by Parent components to retrieve the dom node of the BiteGraph SVG
}

export default withZoom(DiscreteBiteGraph)
