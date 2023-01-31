import { get } from "lodash";
import React from "react";
import { Col, Row, Card, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RoutesData } from "../../../routes";

interface P {
  boxes: any[];
  appId: number;
  boxKey: string;
}

export function BoxesWidget({ boxes, appId, boxKey }: P) {
  let navigate = useNavigate();

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Header className="border-bottom border-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{boxKey} Notes</h5>
        <Button
          variant="primary"
          type="submit"
          onClick={() => {
            navigate(`/dashboard/box/${appId}/${boxKey}`);
          }}
        >
          View/Edit
        </Button>
      </Card.Header>
    </Card>
  );
}
