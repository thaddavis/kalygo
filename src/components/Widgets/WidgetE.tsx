import { Col, Row, Card, Image, ListGroup } from "react-bootstrap";

interface P {
  escrowAmount1: string;
  escrowAmount2: string;
  totalValue: string;
}

export const EscrowContractAmountsWidget = (props: P) => {
  const { escrowAmount1, escrowAmount2, totalValue } = props;

  const CustomRow = (props: any) => {
    const {
      role,
      address,
    }: {
      role: string;
      address: string;
    } = props;

    return (
      <ListGroup.Item className="px-0">
        <Row className="align-items-center">
          <Col className="col-auto">
            <h5 className="h5 mb-0">{role}</h5>
          </Col>
          <Col className="col-auto">
            <h6 className="h6 mb-0">{address}</h6>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header className="border-bottom border-light d-flex justify-content-between">
        <h5 className="mb-0">Escrow</h5>
      </Card.Header>
      <Card.Body>
        <ListGroup className="list-group-flush list my--3">
          <CustomRow role={"Escrow Amount 1"} address={escrowAmount1} />
          <CustomRow role={"Escrow Amount 2"} address={escrowAmount2} />
          <CustomRow role={"Total Value"} address={totalValue} />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
