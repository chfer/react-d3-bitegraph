// src/components/DiscreteBiteGraph/DiscreteBiteGraph.jsx

import React from 'react'
import PropTypes from 'prop-types'

import { getVisibleDataSlice } from '../common/helpers'
import simplifyDiscreteData from './simplifyDiscreteData'
import { createTimeScale, createDiscreteScale } from '../common/biteGraphScales'
import DataAreaRect from '../common/DataAreaRect.jsx'
import ClipPath from '../common/ClipPath.jsx'
import TimeAxis from '../Axis/TimeAxis.jsx'
import DataAxis from '../Axis/DataAxis.jsx'
import YAxisLegend from '../Axis/YAxisLegend.jsx'
import DiscreteDataLayer from './DiscreteDataLayer.jsx'
import DiscreteDataReader from './DiscreteDataReader.jsx'
import Stats from '../common/Stats.jsx'
import DiscreteStatValues from './DiscreteStatValues.jsx'
import { statusDataType } from '../common/DataTypes'
import { styles, dataHeight, dataWidth } from '../common/biteGraphStyles'

import { withZoom } from '../common/Zoomable.jsx'

export function DiscreteBiteGraph(props) {
  const {
    data,
    domain,
    colorScale,
    stateName,
    zoomTransform,
    dataReader,
    transition,
    zoombaseRef
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
  let { visibleData } = getVisibleDataSlice(data, dataWidth, timeScale, 10)
  console.group('DiscreteBiteGraph')
  console.log(`Visible data slice: ${visibleData.length} points ...`)
  const MAXPIXELCOUNT = 500
  if (visibleData.length > MAXPIXELCOUNT) {
    // simplify the data
    visibleData = simplifyDiscreteData(visibleData, MAXPIXELCOUNT)
    console.log(`Simplified the data to ${visibleData.length} points ...`)
  }
  // Define a reference to an overlay rectangle which contains the data area of the graph
  // this overlay rectangle will capture mouse events for the DataReader component and zoom
  let dataAreaRectRef = null
  console.log(`zoomTransform: ${JSON.stringify(zoomTransform)}`)
  console.groupEnd()
  return (
    <svg
      className="BiteGraph discrete"
      width="100%"
      height="100%"
      viewBox={`-${paddingLeft} -${paddingTop} ${width} ${height}`}
    >
      {/* render a Data rectangle which will define the (data-)area where mouse events will be captured for data reading, zooming and panning*/}
      <DataAreaRect
        width={dataWidth}
        height={dataHeight}
        dataAreaRectRef={el => {
          zoombaseRef(el)
          dataAreaRectRef = el
        }}
      />
      <TimeAxis scale={timeScale} dataHeight={dataHeight} />
      <DataAxis scale={dataScale} />
      <YAxisLegend y={-paddingLeft} dy="1.5em" text={`${stateName.long}`} />
      <ClipPath
        width={dataWidth}
        height={dataHeight}
        id="BiteGraph-discrete-clippath"
      />
      <DiscreteDataLayer
        timeScale={timeScale}
        dataScale={dataScale}
        data={visibleData}
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
          getDataRectRef={() => dataAreaRectRef}
        />
      )}
      <Stats
        data={data}
        dataWidth={dataWidth}
        timeScale={timeScale}
        position={{ y: -paddingTop }}
        renderStatValues={(data, position) => (
          <DiscreteStatValues
            data={data}
            domain={domain}
            colorScale={colorScale}
            position={position}
          />
        )}
      />
    </svg>
  )
}

DiscreteBiteGraph.defaultProps = {
  colorScale: () => '#007bff',
  zoomTransform: null,
  dataReader: true,
  transition: true
}

DiscreteBiteGraph.propTypes = {
  data: PropTypes.arrayOf(statusDataType).isRequired,
  domain: PropTypes.arrayOf(PropTypes.string).isRequired,
  colorScale: PropTypes.func,
  stateName: PropTypes.shape({
    short: PropTypes.string,
    long: PropTypes.string
  }),
  zoomTransform: PropTypes.object, //d3 zoom transform object
  dataReader: PropTypes.bool,
  transition: PropTypes.bool,
  zoombaseRef: PropTypes.func // used by Parent components to retrieve the dom node of the BiteGraph <DataAreaRect />
}

export default withZoom(DiscreteBiteGraph)
