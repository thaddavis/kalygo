import { Col, Row, Card, ListGroup } from "react-bootstrap";

interface P {
  buyer: string;
  seller: string;
  clawbackAddress: string;
}

export const RolesWidget = (props: P) => {
  const { buyer, seller, clawbackAddress } = props;

  const TeamMember = (props: any) => {
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
          <Col className="ms--2">
            <small className="mb-0">{address}</small>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header className="border-bottom border-light d-flex justify-content-between">
        <h5 className="mb-0">Roles</h5>
      </Card.Header>
      <Card.Body>
        <ListGroup className="list-group-flush list my--3">
          <TeamMember role={"Buyer"} address={buyer} />
          <TeamMember role={"Seller"} address={seller} />
          <TeamMember role={"Clawbacker"} address={clawbackAddress} />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
