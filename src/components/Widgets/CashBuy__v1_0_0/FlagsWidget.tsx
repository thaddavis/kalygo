import { Col, Row, Card, ListGroup } from "react-bootstrap";

import { BsCircle, BsFillCheckCircleFill } from "react-icons/bs";

interface P {
  signalBuyerArbitration: number;
  signalPullOut: number;
  signalSellerArbitration: number;
}

export const FlagsWidget = (props: P) => {
  const { signalBuyerArbitration, signalPullOut, signalSellerArbitration } =
    props;

  let buyerArbitrationUI;
  if (signalBuyerArbitration === -1) {
    buyerArbitrationUI = <BsCircle />;
  } else if (signalBuyerArbitration === 0) {
    buyerArbitrationUI = <BsCircle />;
  } else {
    buyerArbitrationUI = <BsFillCheckCircleFill />;
  }

  let sellerArbitrationUI;
  if (signalSellerArbitration === -1) {
    sellerArbitrationUI = <BsCircle />;
  } else if (signalSellerArbitration === 0) {
    sellerArbitrationUI = <BsCircle />;
  } else {
    sellerArbitrationUI = <BsFillCheckCircleFill />;
  }

  let pullOutUI;
  if (signalPullOut === -1) {
    pullOutUI = <BsCircle />;
  } else if (signalPullOut === 0) {
    pullOutUI = <BsCircle />;
  } else {
    pullOutUI = <BsFillCheckCircleFill />;
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
                <h5 className="h5 mb-0">Buyer Pullout Flag</h5>
              </Col>
              <Col className="col-auto">
                <h6 className="h6 mb-0">{pullOutUI}</h6>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item className="px-0">
            <Row className="align-items-center">
              <Col className="col-auto">
                <h5 className="h5 mb-0">Buyer Arbitration Flag</h5>
              </Col>
              <Col className="col-auto">
                <h6 className="h6 mb-0">{buyerArbitrationUI}</h6>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item className="px-0">
            <Row className="align-items-center">
              <Col className="col-auto">
                <h5 className="h5 mb-0">Seller Arbitration Flag</h5>
              </Col>
              <Col className="col-auto">
                <h6 className="h6 mb-0">{sellerArbitrationUI}</h6>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
