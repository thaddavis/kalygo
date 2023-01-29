import { get } from "lodash";
import React from "react";
import { Col, Row, Card, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RoutesData } from "../../../routes";

interface P {
  boxes: any[];
  appId: number;
}

export function BoxesWidget({ boxes, appId }: P) {
  let navigate = useNavigate();

  const BoxKey = ({ boxName }: { boxName: string }) => {
    return (
      <ListGroup.Item className="px-0">
        <Row className="align-items-center">
          <Col className="col-auto">
            <h5 className="h5 mb-0">{boxName}</h5>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Header className="border-bottom border-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Buyer Notes ({boxes.length})</h5>
        <Button
          variant="primary"
          type="submit"
          onClick={() => {
            navigate(`/dashboard/boxes/${appId}`);
          }}
        >
          View Box Data
        </Button>
      </Card.Header>
      {/* <Card.Body> */}
      {/* <ListGroup className="list-group-flush list my--3">
          {boxes.map((val, idx) => {
            return (
              <BoxKey
                boxName={get(val, "attribute_map.name", "Not Found")}
                key={get(val, "attribute_map.name", "Not Found")}
              />
            );
          })}
        </ListGroup> */}
      {/* </Card.Body> */}
    </Card>
  );
}
