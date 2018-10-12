// src/components/common/Zoomable.jsx

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import * as d3 from 'd3'

import { styles, dataHeight, dataWidth } from '../common/biteGraphStyles'
import HomeButton from '../common/HomeButton.jsx'

const BiteGraphContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
`

const BiteGraphDataContainer = styled.div`
  flex: 0 1 auto;
  width: 100%;
  height: 100%;
  cursor: ${({ panning, zooming, zoomDirection }) => {
    if (panning) {
      return 'grabbing'
    } else if (zooming && zoomDirection === 'In') {
      return 'zoom-in'
    } else if (zooming && zoomDirection === 'Out') {
      return 'zoom-out'
    } else {
      return 'auto'
    }
  }};
`

const BiteGraphControlsContainer = styled.div`
  width: 1.5rem;
  height: 100%;
`

export class Zoomable extends React.Component {
  constructor(props) {
    super(props)

    this.svgRef = null
    this.state = {
      zooming: false,
      zoomScale: 1,
      zoomDirection: 'None', // can be 'None', 'In' or 'Out'
      panning: false,
      zoomTransform: null
    }
    this.zoom = this.initZoom(props)
    this.resetZoom = this.resetZoom.bind(this)
  }

  initZoom(props) {
    // console.log('Initializing zoom ...')
    const zoomStartHandler = () => {
      const eventType = d3.event.sourceEvent ? d3.event.sourceEvent.type : ''
      // console.log(`Zoom START - ${eventType} (${new Date().getTime()})`)
      this.setState(state => ({
        zooming: eventType === 'wheel' ? true : state.zooming,
        zoomDirection: 'None',
        panning: eventType === 'mousedown' ? true : state.panning
      }))
    }
    const zoomEndHandler = () => {
      const eventType = d3.event.sourceEvent ? d3.event.sourceEvent.type : ''
      // console.log(`Zoom END - ${eventType} (${new Date().getTime()})`)
      this.setState(state => ({
        zooming: false,
        zoomDirection: 'None',
        panning: eventType === 'mouseup' ? false : state.panning
      }))
    }
    const zoomHandler = () => {
      // console.log(
      //   `ZoomING - scale: ${d3.event.transform.k} x: ${
      //     d3.event.transform.x
      //   } y: ${d3.event.transform.y}`
      // )

      this.setState(state => {
        const scale = d3.event.transform.k
        let zoomDirection = 'None'
        if (scale > state.zoomScale) {
          zoomDirection = 'In'
        } else if (scale < state.zoomScale) {
          zoomDirection = 'Out'
        }
        return {
          zoomDirection,
          zoomScale: scale,
          zoomTransform: d3.event.transform
        }
      })
    }
    return d3
      .zoom()
      .scaleExtent([1, this.props.maxZoomLevel])
      .translateExtent([[0, 0], [dataWidth, dataHeight]])
      .extent([[0, 0], [dataWidth, dataHeight]])
      .on('zoom', zoomHandler)
      .on('start', zoomStartHandler)
      .on('end', zoomEndHandler)
  }

  resetZoom() {
    // console.log(`Resetting zoom if possible ...`)
    if (this.svgRef && this.zoom) {
      d3.select(this.svgRef)
        .transition()
        .call(this.zoom.transform, d3.zoomIdentity)
    }
  }

  componentDidMount() {
    if (this.svgRef && this.zoom) {
      // console.log('Attaching zoom to mounted svg element ...')
      d3.select(this.svgRef).call(this.zoom)
    }
  }

  render() {
    const {
      zooming,
      zoomDirection,
      zoomScale,
      panning,
      zoomTransform
    } = this.state
    const fetchSvgRef = element => {
      this.svgRef = element
    }
    return (
      <BiteGraphContainer>
        <BiteGraphDataContainer {...this.state}>
          {this.props.children(fetchSvgRef, this.state)}
        </BiteGraphDataContainer>
        <BiteGraphControlsContainer>
          {zoomScale > 1 && (
            <HomeButton
              x={0}
              y={0}
              width="100%"
              height="100%"
              color="#444"
              onClick={this.resetZoom}
            />
          )}
        </BiteGraphControlsContainer>
      </BiteGraphContainer>
    )
  }
}

Zoomable.defaultProps = {
  maxZoomLevel: Infinity
}

Zoomable.propTypes = {
  maxZoomLevel: PropTypes.number
}

export function withZoom(BiteGraph) {
  return props => (
    <Zoomable maxZoomLevel={props.data.length / 2}>
      {(fetchSvgRef, { zoomTransform, zooming, panning }) => (
        <BiteGraph
          svgRef={fetchSvgRef}
          zoomtransform={zoomTransform}
          datareader={!(panning || zooming)}
          transition={!(panning || zooming)}
          {...props}
        />
      )}
    </Zoomable>
  )
}
