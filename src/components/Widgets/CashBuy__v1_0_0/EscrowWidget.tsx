import { Card, Col, ListGroup, Row } from "react-bootstrap";

interface P {
  escrowAmount1: number;
  escrowAmount2: number;
  totalValue: number;
  balance: number;
  fungibleTokenName: string;
  fungibleTokenBalance: number;
  now: number;
  inspectionPeriodEnd: number;
  closingDate: number;
}

export const EscrowWidget = (props: P) => {
  const {
    balance,
    escrowAmount1,
    escrowAmount2,
    totalValue,
    fungibleTokenName,
    fungibleTokenBalance,
    now,
    inspectionPeriodEnd,
    closingDate,
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

  // debugger;

  return (
    <Card
      border={fungibleTokenBalance >= totalValue ? "success" : "light"}
      className="shadow-sm"
    >
      <Card.Header className="border-bottom border-light d-flex justify-content-between">
        <h5 className="mb-0">Escrow</h5>
      </Card.Header>
      <Card.Body>
        <ListGroup className="list-group-flush list my--3">
          <CustomRow
            theKey={"Escrow Token Balance"}
            value={
              fungibleTokenBalance < 0
                ? "Ø"
                : `${fungibleTokenBalance} ${escrowTokenName}`
            }
          />

          <CustomRow
            theKey={"Minimum Balance (200,000 mAlgos)"}
            value={balance < 0 ? "Ø" : `${balance} mAlgos`}
          />
          <CustomRow
            theKey={"Escrow Amount 1"}
            value={
              escrowAmount1 < 0 ? "Ø" : `${escrowAmount1} ${escrowTokenName}`
            }
          />
          <CustomRow
            theKey={"Escrow Amount 2"}
            value={
              escrowAmount2 < 0 ? "Ø" : `${escrowAmount2} ${escrowTokenName}`
            }
          />
          <CustomRow
            theKey={"Sale Price"}
            value={totalValue < 0 ? "Ø" : `${totalValue} ${escrowTokenName}`}
          />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
