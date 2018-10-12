// App.jsx

import React from 'react'

import { Container, Row, Col, Button } from 'reactstrap'
import {
  analogRandomData,
  discreteRandomData,
  getDiscreteDataDomain,
  discreteColorScale
} from './common/randomdata'
import AnalogBiteGraph from './AnalogBiteGraph/AnalogBiteGraph.jsx'
import DiscreteBiteGraph from './DiscreteBiteGraph/DiscreteBiteGraph.jsx'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      analogData: analogRandomData(),
      discreteData: discreteRandomData()
    }
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
    return (
      <Container>
        <Row className="analogData">
          <Col xs={12} md={11}>
            <AnalogBiteGraph data={this.state.analogData} zoomable />
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
              domain={getDiscreteDataDomain()}
              colorScale={discreteColorScale}
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
