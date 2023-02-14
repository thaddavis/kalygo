import { get } from "lodash";
import React, { useEffect } from "react";
import { Col, Row, Card, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RoutesData } from "../../../routes";

interface P {
  appId: number;
  //   appAddress: string;
}

export function UpdateContractWidget({ appId }: P) {
  let navigate = useNavigate();

  // useEffect(() => {
  //   console.log("___ ___ ___");
  // });

  return (
    <Card border="light" className="shadow-sm mb-4">
      <Card.Header className="border-bottom border-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Revise Contract</h5>
        <Button
          variant="primary"
          type="submit"
          onClick={() => {
            navigate(`/dashboard/app/cashBuy__v1_0_0/${appId}/update`);
          }}
        >
          View/Edit
        </Button>
      </Card.Header>
    </Card>
  );
}
