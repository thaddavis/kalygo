import { Col, Row, Card, Image, ListGroup } from "react-bootstrap";

interface P {
  escrowAmount1: string;
  escrowAmount2: string;
  totalValue: string;
  balance: number | string;
  minBalance: number | string;
}

export const EscrowContractAmountsWidget = (props: P) => {
  const { balance, escrowAmount1, escrowAmount2, totalValue, minBalance } =
    props;

  const CustomRow = (props: any) => {
    const {
      theKey,
      value,
    }: {
      theKey: string;
      value: string;
    } = props;

    return (
      <ListGroup.Item className="px-0">
        <Row className="align-items-center">
          <Col className="col-auto">
            <h5 className="h5 mb-0">{theKey}</h5>
          </Col>
          <Col className="col-auto">
            <h6 className="h6 mb-0">{value}</h6>
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
          <CustomRow theKey={"Balance"} value={balance} />
          <CustomRow theKey={"Minimum Balance"} value={minBalance} />
          <CustomRow theKey={"Escrow Amount 1"} value={escrowAmount1} />
          <CustomRow theKey={"Escrow Amount 2"} value={escrowAmount2} />
          <CustomRow theKey={"Total Value"} value={totalValue} />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
