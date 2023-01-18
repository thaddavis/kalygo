import React, { useState, useEffect } from "react";
import get from "lodash/get";
import { useParams } from "react-router-dom";

import {
  Col,
  Row,
  Card,
  Image,
  Button,
  ListGroup,
  ProgressBar,
  Table,
} from "react-bootstrap";

import { RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { parseGlobalState } from "../../../pages/customSelectors/appl/parseGlobalState";

import algosdk from "algosdk";

import { pageVisits, pageTraffic, pageRanking } from "../../../data/tables";
import { Algod } from "../../../services/algod";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const AssetDimensions = (props: { field: string; value: string }) => {
  const { field, value } = props;

  return (
    <ListGroup.Item className="px-0">
      <Row className="align-items-center">
        <Col className="col-auto">
          <h5 className="h5 mb-0">{field}</h5>
        </Col>
        <Col className="ms--2 truncate-text">
          <small className="mb-0">{value}</small>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

interface P {}

export const AssetInfoWidget = (props: P) => {
  const [app, setApp] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  const settings = useAppSelector((state: RootState) => state.settings);
  let { id } = useParams();

  console.log("AssetInfoWidget id", id);

  useEffect(() => {
    async function fetch() {
      try {
        const appResponse = await Algod.getIndexer(settings.selectedNetwork)
          .lookupAssetByID(Number.parseInt(id!))
          .do();

        console.log("appResponse", appResponse);

        setApp({
          val: appResponse,
          loading: false,
          error: null,
        });
      } catch (e) {
        setApp({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    fetch();
  }, []);

  console.log("app.val", app.val);

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">Asset Info</h5>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <ListGroup className="list-group-flush list my--3">
          <Row>
            <Col>
              <AssetDimensions
                field={"Name"}
                value={get(app, "val.asset.params.name", "ø")}
              />
            </Col>
            <Col>
              <AssetDimensions
                field={"Unit Name"}
                value={get(app, "val.asset.params.unit-name", "ø")}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <AssetDimensions
                field={"Supply"}
                value={get(app, "val.asset.params.total", "ø")}
              />
            </Col>
            <Col>
              <AssetDimensions
                field={"URL"}
                value={get(app, "val.asset.params.url", "ø")}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AssetDimensions
                field={"Creator"}
                value={get(app, "val.asset.params.creator", "ø")}
              />
            </Col>
            <Col>
              <AssetDimensions
                field={"Clawback"}
                value={get(app, "val.asset.params.clawback", "ø")}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <AssetDimensions
                field={"Manager"}
                value={get(app, "val.asset.params.manager", "ø")}
              />
            </Col>
            <Col>
              <AssetDimensions
                field={"Freeze"}
                value={get(app, "val.asset.params.freeze", "ø")}
              />
            </Col>
          </Row>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};
