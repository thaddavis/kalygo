import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import get from "lodash/get";

import { Col, Row, Button, Dropdown } from "react-bootstrap";

import { RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Algod } from "../../../services/algod";
import { useParams } from "react-router-dom";
import { parseGlobalState } from "../../customSelectors/appl/parseGlobalState";
import { ErrorBoundary } from "../../../components/ErrorBoundary";

import algosdk from "algosdk";
import { HoldersTable } from "../../../components/Widgets/ASA/HoldersTable";
import { AssetInfoWidget } from "../../../components/Widgets/ASA/AssetInfoWidget";

function OverviewAsset() {
  const settings = useAppSelector((state: RootState) => state.settings);

  let { id } = useParams();

  return (
    <>
      <div className="d-flex flex-column justify-content-between flex-wrap flex-md-nowrap py-4"></div>
      <Row>
        <Col xs={12} className="mb-4">
          <AssetInfoWidget />
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="mb-4">
          <HoldersTable />
        </Col>
      </Row>
    </>
  );
}

export default OverviewAsset;
