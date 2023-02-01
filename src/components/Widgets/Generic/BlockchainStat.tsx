import React from "react";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const BlockchainStatWidget = (props: {
  field: string;
  value: string;
  loading: boolean;
}) => {
  const { field, value, loading } = props;

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body>
        <Row className="d-block d-xl-flex justify-content-center align-items-center">
          <Col className="text-xl-center d-flex align-items-center justify-content-xl-center mb-3 mb-xl-0">
            <div>
              <h5>{field}</h5>
              {loading ? (
                <h3 className="mb-1">...</h3>
              ) : (
                <h3 className="mb-1">{value}</h3>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
