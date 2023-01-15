import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import get from "lodash/get";

import { Col, Row, Button, Dropdown } from "react-bootstrap";
import { SettingsForm } from "../components/Forms/SettingsForm";

import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Algod } from "../services/algod";
import { useParams } from "react-router-dom";
import { parseGlobalState } from "./customSelectors/appl/parseGlobalState";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { RolesWidget } from "../components/Widgets/RolesWidget";
import { EscrowContractTimelineWidget } from "../components/Widgets/ContractTimelineWidget";
import { EscrowWidget } from "../components/Widgets/EscrowWidget";
import { FlagsWidget } from "../components/Widgets/FlagsWidget";

import algosdk from "algosdk";
import { ActionsWidget } from "../components/Widgets/ActionsWidget";

function AssetDetail() {
  const [asset, setAsset] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  // const [account, setAccount] = useState<any>({
  //   val: undefined,
  //   loading: false,
  //   error: undefined,
  // });

  const settings = useAppSelector((state: RootState) => state.settings);

  let { id } = useParams();

  useEffect(() => {
    console.log("load the AssetDetail page", id);

    async function fetch() {
      try {
        const assetInfo = await Algod.getIndexer(settings.selectedNetwork)
          .lookupAssetBalances(Number.parseInt(id!))
          .do();
        console.log(
          "Information for Asset: " + JSON.stringify(assetInfo, undefined, 2)
        );

        setAsset({
          val: assetInfo,
          loading: false,
          error: null,
        });
      } catch (e) {
        console.error("___ ___ ___", e);
        setAsset({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    fetch();
  }, []);

  // useEffect(() => {
  //   async function fetch() {
  //     try {
  //       const appResponse = await Algod.getIndexer(settings.selectedNetwork)
  //         .lookupApplications(Number.parseInt(id!))
  //         .do();

  //       setApp({
  //         val: parseGlobalState(
  //           appResponse?.application?.params &&
  //             appResponse.application.params["global-state"]
  //         ),
  //         loading: false,
  //         error: null,
  //       });

  //       const appAddress = await algosdk.getApplicationAddress(
  //         Number.parseInt(id!)
  //       );

  //       const accountResponse = await Algod.getAlgod(settings.selectedNetwork)
  //         .accountInformation(appAddress)
  //         .do();

  //       setAccount({
  //         val: accountResponse,
  //         loading: false,
  //         error: null,
  //       });
  //     } catch (e) {
  //       setApp({
  //         val: null,
  //         loading: false,
  //         error: e,
  //       });
  //     }
  //   }

  //   fetch();
  // }, []);

  const ParsedAssetState = () => {
    try {
      return <pre>{JSON.stringify(asset.val, undefined, 2)}</pre>;
    } catch (e) {
      throw e;
    }
  };

  return (
    <ErrorBoundary>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4"></div>
      <Row>
        <Col xs={12} md={8} xl={8}>
          {asset.val && (
            <ErrorBoundary>
              <ParsedAssetState />
            </ErrorBoundary>
          )}
        </Col>

        {/* {account.val && !account.error && !account.loading && (
          <Col xs={12} md={8} xl={8}>
            <pre>{JSON.stringify(account.val, undefined, 2)}</pre>
          </Col>
        )} */}
      </Row>
    </ErrorBoundary>
  );
}

export default AssetDetail;
