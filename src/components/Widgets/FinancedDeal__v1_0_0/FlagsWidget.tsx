import { Col, Row, Card, ListGroup } from "react-bootstrap";

import { BsCircle, BsFillCheckCircleFill } from "react-icons/bs";

interface P {
  signalArbitration: string;
  signalPullOut: string;
  lenderApproves: string;
}

export const FlagsWidget = (props: P) => {
  const { signalArbitration, signalPullOut, lenderApproves } = props;

  let arbitrationUI;
  if (Number.parseInt(signalArbitration) === -1) {
    arbitrationUI = <BsCircle />;
  } else if (Number.parseInt(signalArbitration) === 0) {
    arbitrationUI = <BsCircle />;
  } else {
    arbitrationUI = <BsFillCheckCircleFill />;
  }

  let pullOutUI;
  if (Number.parseInt(signalPullOut) === -1) {
    pullOutUI = <BsCircle />;
  } else if (Number.parseInt(signalPullOut) === 0) {
    pullOutUI = <BsCircle />;
  } else {
    pullOutUI = <BsFillCheckCircleFill />;
  }

  let lenderApprovesUI;
  if (Number.parseInt(lenderApproves) === -1) {
    lenderApprovesUI = <BsCircle />;
  } else if (Number.parseInt(lenderApproves) === 0) {
    lenderApprovesUI = <BsCircle />;
  } else {
    lenderApprovesUI = <BsFillCheckCircleFill />;
  }

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header className="border-bottom border-light d-flex justify-content-between">
        <h5 className="mb-0">Flags</h5>
      </Card.Header>
      <Card.Body>
        <ListGroup className="list-group-flush list my--3">
          <ListGroup.Item className="px-0">
            <Row className="align-items-center">
              <Col className="col-auto">
                <h5 className="h5 mb-0">Signal Pull Out</h5>
              </Col>
              <Col className="col-auto">
                <h6 className="h6 mb-0">{pullOutUI}</h6>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item className="px-0">
            <Row className="align-items-center">
              <Col className="col-auto">
                <h5 className="h5 mb-0">Signal Arbitration</h5>
              </Col>
              <Col className="col-auto">
                <h6 className="h6 mb-0">{arbitrationUI}</h6>
              </Col>
            </Row>
          </ListGroup.Item>

          <ListGroup.Item className="px-0">
            <Row className="align-items-center">
              <Col className="col-auto">
                <h5 className="h5 mb-0">Lender Approves</h5>
              </Col>
              <Col className="col-auto">
                <h6 className="h6 mb-0">{lenderApprovesUI}</h6>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
