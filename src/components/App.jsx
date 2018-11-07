// App.jsx

import React from 'react'

import discreteResponse from '../../data/discrete_bewid_radiation.json'
import analogResponse from '../../data/analog_bejab_txmagtempval.json'

import { Container, Row, Col, Button } from 'reactstrap'
import {
  analogRandomData,
  // analogSchema,
  discreteRandomData,
  // discreteSchema,
  // getDiscreteDataDomain,
  discreteColorScale
} from './common/randomdata'

import {
  getBiteData,
  getDiscreteDomain,
  getStateName,
  getUnit,
  makeDiscreteColorScale
} from '../api/'
import AnalogBiteGraph from './AnalogBiteGraph/AnalogBiteGraph.jsx'
import DiscreteBiteGraph from './DiscreteBiteGraph/DiscreteBiteGraph.jsx'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   analogData: analogRandomData(),
    //   discreteData: discreteRandomData()
    // }
    this.state = {
      analogData: getBiteData(analogResponse),
      discreteData: getBiteData(discreteResponse)
    }
    this.discreteDomain = getDiscreteDomain(discreteResponse)
    this.analogStateName = getStateName(analogResponse)
    this.analogUnit = getUnit(analogResponse)
    this.discreteStateName = getStateName(discreteResponse)
    this.colorScale = makeDiscreteColorScale(discreteResponse)
  }

  randomnizeAnalog() {
    this.setState({ analogData: analogRandomData() })
  }

  randomnizeDiscrete() {
    this.setState({ discreteData: discreteRandomData() })
  }

  render() {
    // console.log(JSON.stringify(this.state.analogData))
    // console.log(JSON.stringify(this.state.discreteData))
    // console.log(
    //   `discrete Domain: ${JSON.stringify(getDiscreteDomain(discreteResponse))}`
    // )
    return (
      <Container>
        <Row className="analogData">
          <Col xs={12} md={11}>
            <AnalogBiteGraph
              data={this.state.analogData}
              stateName={this.analogStateName}
              unit={this.analogUnit}
              transition={false}
            />
          </Col>
          <Col xs={12} md={1}>
            <Button onClick={() => this.randomnizeAnalog()}>
              Randomnize Analog
            </Button>
          </Col>
        </Row>
        <Row className="discreteData">
          <Col xs={12} md={11}>
            <DiscreteBiteGraph
              data={this.state.discreteData}
              domain={this.discreteDomain}
              colorScale={this.colorScale}
              stateName={this.discreteStateName}
              transition={false}
            />
          </Col>
          <Col xs={12} md={1}>
            <Button onClick={() => this.randomnizeDiscrete()}>
              Randomnize Discrete
            </Button>
          </Col>
        </Row>
      </Container>
    )
  }
}
