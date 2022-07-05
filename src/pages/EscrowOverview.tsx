import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCog,
  faHome,
  faSearch,
  faTruckLoading,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCashRegister,
  faChartLine,
  faCloudUploadAlt,
  faPlus,
  faRocket,
  faTasks,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Form, Button, Dropdown } from "react-bootstrap";

import { CreatedAppsTable } from "../components/Widgets/TableA";
import { useNavigate } from "react-router-dom";

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
                navigate(`/dashboard/new-contract`);
              }}
            >
              <FontAwesomeIcon icon={faTasks} className="me-2" /> New Contract
            </Dropdown.Item>
            {/* <Dropdown.Item className="fw-bold">
              <FontAwesomeIcon icon={faCloudUploadAlt} className="me-2" />{" "}
              Reload
            </Dropdown.Item> */}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <CreatedAppsTable />
    </>
  );
};

export default EscrowOverview;
