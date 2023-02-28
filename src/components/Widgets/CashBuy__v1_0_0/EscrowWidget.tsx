import { Card, Col, ListGroup, Row } from "react-bootstrap";

interface P {
  escrowAmount1: number;
  escrowAmount2: number;
  totalValue: number;
  balance: number;
  fungibleTokenName: string;
  fungibleTokenBalance: number;
  fungibleTokenDecimals: number;
  now: number;
  inspectPeriodEnd: number;
  closingDate: number;
}

function moveDecimal(n: number, moveDecimalLeftBy: number) {
  // var l = n.toString().length - 0;
  // var v = n / Math.pow(10, l);

  n /= Math.pow(10, moveDecimalLeftBy);
  return n;
}

export const EscrowWidget = (props: P) => {
  const {
    balance,
    escrowAmount1,
    escrowAmount2,
    totalValue,
    fungibleTokenName,
    fungibleTokenBalance,
    fungibleTokenDecimals,
    now,
    inspectPeriodEnd,
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

  const escrowTokenName = fungibleTokenName || "";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    // maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
  });

  const balanceFORMATTED = balance;
  const fungibleTokenBalanceFORMATTED = formatter.format(
    moveDecimal(fungibleTokenBalance, fungibleTokenDecimals)
  );
  const escrowAmount1FORMATTED =
    escrowAmount1 && fungibleTokenDecimals
      ? formatter.format(moveDecimal(escrowAmount1, fungibleTokenDecimals))
      : "ø";
  const escrowAmount2FORMATTED =
    escrowAmount2 && fungibleTokenDecimals
      ? formatter.format(moveDecimal(escrowAmount2, fungibleTokenDecimals))
      : "ø";
  const totalValueFORMATTED =
    totalValue && fungibleTokenDecimals
      ? formatter.format(moveDecimal(totalValue, fungibleTokenDecimals))
      : "ø";

  return (
    <Card
      border={
        fungibleTokenBalance > 0 &&
        totalValue > 0 &&
        fungibleTokenBalance >= totalValue
          ? "success"
          : "light"
      }
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
                : `${fungibleTokenBalanceFORMATTED} ${escrowTokenName}`
            }
          />

          <CustomRow
            theKey={"MBR (1.8446 ALGO)"}
            value={
              balance < 0
                ? "Ø"
                : `${balanceFORMATTED.toLocaleString("en-US")} mAlgos`
            }
          />
          <CustomRow
            theKey={"Escrow Amount 1"}
            value={
              escrowAmount1 < 0
                ? "Ø"
                : `${escrowAmount1FORMATTED} ${escrowTokenName}`
            }
          />
          <CustomRow
            theKey={"Escrow Amount 2"}
            value={
              escrowAmount2 < 0
                ? "Ø"
                : `${escrowAmount2FORMATTED} ${escrowTokenName}`
            }
          />
          <CustomRow
            theKey={"Total Price"}
            value={
              totalValue < 0 ? "Ø" : `${totalValueFORMATTED} ${escrowTokenName}`
            }
          />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
