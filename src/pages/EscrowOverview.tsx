import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPlus, faTasks } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Button, Dropdown } from "react-bootstrap";

import { CreatedAppsTable } from "../components/Widgets/TableA";
import { useNavigate } from "react-router-dom";
import { RoutesData } from "../routes";

const EscrowOverview = () => {
  let navigate = useNavigate();

  return (
    <>
      <div className="d-flex flex-column justify-content-between flex-wrap flex-md-nowrap py-4">
        <Dropdown className="btn-toolbar">
          <Dropdown.Toggle
            as={Button}
            variant="primary"
            size="sm"
            className="me-2"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Actions
          </Dropdown.Toggle>
          <Dropdown.Menu className="dashboard-dropdown dropdown-menu-left mt-2">
            <Dropdown.Item
              className="fw-bold"
              onClick={() => {
                navigate(RoutesData.NewFinanceDealContract.path);
              }}
            >
              <FontAwesomeIcon icon={faTasks} className="me-2" /> New Contract
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <CreatedAppsTable />
    </>
  );
};

export default EscrowOverview;
