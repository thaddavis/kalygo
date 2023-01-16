import { Col, Row, Card, Image, ListGroup } from "react-bootstrap";

interface P {
  escrowAmount1: string;
  escrowAmount2: string;
  totalValue: string;
  balance: number | string;
  fungibleTokenName: string;
  fungibleTokenBalance: number | string;
}

export const EscrowWidget = (props: P) => {
  const {
    balance,
    escrowAmount1,
    escrowAmount2,
    totalValue,
    fungibleTokenName,
    fungibleTokenBalance,
  } = props;

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

  // console.log("fungibleToken", fungibleToken);

  const escrowTokenName = fungibleTokenName;

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header className="border-bottom border-light d-flex justify-content-between">
        <h5 className="mb-0">Escrow</h5>
      </Card.Header>
      <Card.Body>
        <ListGroup className="list-group-flush list my--3">
          <CustomRow theKey={"Escrow Token"} value={escrowTokenName} />
          <CustomRow
            theKey={"Escrow Token Balance"}
            value={fungibleTokenBalance}
          />

          <CustomRow theKey={"Balance"} value={balance} />
          <CustomRow
            theKey={"Escrow Amount 1"}
            value={`${escrowAmount1} ${escrowTokenName}`}
          />
          <CustomRow
            theKey={"Escrow Amount 2"}
            value={`${escrowAmount2} ${escrowTokenName}`}
          />
          <CustomRow
            theKey={"Sale Price"}
            value={`${totalValue}  ${escrowTokenName}`}
          />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
