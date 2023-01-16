import {
  Col,
  Row,
  Card,
  Image,
  Button,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";

import teamMembers from "../../../data/teamMembers";

interface P {
  buyer: string;
  seller: string;
  arbiter: string;
  buyerRealtor: string;
  sellerRealtor: string;
  lender: string;
  titleCompany: string;
  jurisdiction: string;
}

export const RolesWidget = (props: P) => {
  const {
    buyer,
    seller,
    arbiter,
    buyerRealtor,
    sellerRealtor,
    lender,
    titleCompany,
    jurisdiction,
  } = props;

  const TeamMember = (props: any) => {
    const {
      role,
      address,
    }: {
      role: string;
      address: string;
      //   statusKey: "online" | "inMeeting" | "offline";
      //   btnText: string;
      //   image: string;
    } = props;

    return (
      <ListGroup.Item className="px-0">
        <Row className="align-items-center">
          <Col className="col-auto">
            <h5 className="h5 mb-0">{role}</h5>
          </Col>
          <Col className="ms--2">
            {/* <h6 className="h6 mb-0">{address}</h6> */}
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
          <TeamMember role={"Arbiter"} address={arbiter} />
          <TeamMember role={"Buyer's Realtor"} address={buyerRealtor} />
          <TeamMember role={"Seller's Realtor"} address={sellerRealtor} />
          <TeamMember role={"Title Company"} address={titleCompany} />
          <TeamMember role={"Lender"} address={lender} />
          <TeamMember role={"Jurisdiction"} address={jurisdiction} />
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
