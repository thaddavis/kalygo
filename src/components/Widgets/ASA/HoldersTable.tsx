import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckLoading } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import get from "lodash/get";

import {
  Nav,
  Card,
  Image,
  Button,
  Table,
  Col,
  Row,
  Dropdown,
  ProgressBar,
  Pagination,
  ButtonGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { RoutesData } from "../../../routes";

import { Algod } from "../../../services/algod";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";

import { showErrorToast } from "../../../utility/errorToast";

import { HoldersTableRow } from "./HoldersTableRow";

async function fetchHolders(
  assetId: string,
  settingsState: any,
  assetStateSetter: any,
  nextToken: string = ""
) {
  try {
    const assetInfo = await Algod.getIndexer(settingsState.selectedNetwork)
      .lookupAssetBalances(Number.parseInt(assetId!))
      .nextToken(nextToken)
      .do();
    console.log(
      "Information for Asset: " + JSON.stringify(assetInfo, undefined, 2)
    );

    assetStateSetter({
      val: assetInfo,
      loading: false,
      error: null,
    });
  } catch (e) {
    console.error("___ ___ ___", e);
    assetStateSetter({
      val: null,
      loading: false,
      error: e,
    });
  }
}

export const HoldersTable = () => {
  const settings = useAppSelector((state: RootState) => state.settings);

  const [asset, setAsset] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  let { id } = useParams();

  useEffect(() => {
    console.log("load the AssetDetail page", id);

    fetchHolders(id!, settings, setAsset);
  }, []);

  console.log("asset.val", asset.val);

  const totalHolders = asset?.val?.balances?.length || 0;

  return totalHolders > 0 ? (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">Holders</h5>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">Address</th>
              <th className="border-bottom">Amount</th>
              <th className="border-bottom">Deleted</th>
              <th className="border-bottom">Frozen</th>
            </tr>
          </thead>
          <tbody>
            {asset?.val?.balances?.map((t: any) => {
              // console.log("t", t);

              return <HoldersTableRow key={`holder-${t.address}`} {...t} />;
            })}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Nav>
            <Pagination className="mb-2 mb-lg-0">
              <Pagination.Next
                onClick={() => {
                  fetchHolders(
                    id!,
                    settings,
                    setAsset,
                    get(asset, "val.next-token", "")
                  );
                }}
              >
                Next
              </Pagination.Next>
            </Pagination>
          </Nav>
          <small className="fw-bold">
            Showing <b>{totalHolders}</b> out of <b>{totalHolders}</b> entries
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  ) : (
    <FontAwesomeIcon
      className="d-block mx-auto"
      color="black"
      icon={faTruckLoading}
    />
  );
};
