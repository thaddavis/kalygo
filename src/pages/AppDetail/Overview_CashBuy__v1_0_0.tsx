import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import get from "lodash/get";

import { Col, Row, Button, Dropdown } from "react-bootstrap";
import { SettingsForm } from "../../components/Forms/SettingsForm";

import { RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { OperatorConfig } from "../../components/Widgets/OperatorConfig";
import { Algod } from "../../services/algod";
import { useParams } from "react-router-dom";
import { parseGlobalState } from "../customSelectors/appl/parseGlobalState";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { RolesWidget } from "../../components/Widgets/OverviewCashBuy__v1_0_0/RolesWidget";
import { TimelineWidget } from "../../components/Widgets/OverviewCashBuy__v1_0_0/TimelineWidget";
import { FlagsWidget } from "../../components/Widgets/OverviewCashBuy__v1_0_0/FlagsWidget";
import { EscrowWidget } from "../../components/Widgets/OverviewCashBuy__v1_0_0/EscrowWidget";

import algosdk from "algosdk";
import { ActionsWidget } from "../../components/Widgets/OverviewCashBuy__v1_0_0/ActionsWidget";
import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";

/*
const printAssetHolding = async function (algodclient, account, assetid) {
    let accountInfo = await algodclient.accountInformation(account).do();
    for (idx = 0; idx < accountInfo['assets'].length; idx++) {
        let scrutinizedAsset = accountInfo['assets'][idx];
        if (scrutinizedAsset['asset-id'] == assetid) {
            let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
            console.log("assetholdinginfo = " + myassetholding);
            break;
        }
    }
};
*/

function Overview_CashBuy__v1_0_0() {
  const [app, setApp] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  const [asset, setAsset] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  const [account, setAccount] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  const settings = useAppSelector((state: RootState) => state.settings);

  let { id } = useParams();
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
  //     } catch (e) {
  //       console.log("error!", e);

  //       setApp({
  //         val: null,
  //         loading: false,
  //         error: e,
  //       });
  //     }
  //   }

  //   fetch();
  // }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // STEP 1
        const appResponse = await Algod.getIndexer(settings.selectedNetwork)
          .lookupApplications(Number.parseInt(id!))
          .do();
        setApp({
          val: parseGlobalState(
            appResponse?.application?.params &&
              appResponse.application.params["global-state"]
          ),
          loading: false,
          error: null,
        });
        // STEP 2
        const appAddress = await algosdk.getApplicationAddress(
          Number.parseInt(id!)
        );
        const accountResponse = await Algod.getAlgod(settings.selectedNetwork)
          .accountInformation(appAddress)
          .do();
        setAccount({
          val: accountResponse,
          loading: false,
          error: null,
        });
        // STEP 3 Skipping retrieving stablecoin ASA info because is static
      } catch (e) {
        console.log("error!!", e);

        setApp({
          val: null,
          loading: false,
          error: e,
        });

        setAccount({
          val: null,
          loading: false,
          error: e,
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetch() {
      try {
        // STEP 1
        const appResponse = await Algod.getIndexer(settings.selectedNetwork)
          .lookupApplications(Number.parseInt(id!))
          .do();
        setApp({
          val: parseGlobalState(
            appResponse?.application?.params &&
              appResponse.application.params["global-state"]
          ),
          loading: false,
          error: null,
        });
        const appAddress = await algosdk.getApplicationAddress(
          Number.parseInt(id!)
        );
        // STEP 2
        const accountResponse = await Algod.getAlgod(settings.selectedNetwork)
          .accountInformation(appAddress)
          .do();

        setAccount({
          val: accountResponse,
          loading: false,
          error: null,
        });
        // STEP 3
        let assetInfo = await Algod.getIndexer(settings.selectedNetwork)
          .searchForAssets()
          .index(
            parseGlobalState(
              appResponse?.application?.params &&
                appResponse.application.params["global-state"]
            )["global_asa_id"]
          )
          .do();
        setAsset({
          val: assetInfo,
          loading: false,
          error: false,
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

  const ParsedAppGlobalState = () => {
    try {
      return <pre>{JSON.stringify(app.val, undefined, 2)}</pre>;
    } catch (e) {
      throw e;
    }
  };

  let timelineEvents = [
    {
      title: "Now",
      time: new Date().getTime(),
      color: "purple",
    },
    {
      title: "Closing Date",
      time: new Date(get(app, "val.global_closing_date", 0) * 1000).getTime(),
      color: "green",
    },
    {
      title: "Inspection Ends",
      time: new Date(
        get(app, "val.global_inspection_end_date", 0) * 1000
      ).getTime(),
      color: "orange",
    },
    {
      title: "Inspection Begins",
      time: new Date(
        get(app, "val.global_inspection_start_date", 0) * 1000
      ).getTime(),
      color: "red",
    },
    {
      title: "Free Funds Date",
      time: new Date(
        get(app, "val.global_free_funds_date", 0) * 1000
      ).getTime(),
      color: "pink",
    },
  ];

  function compare(a: any, b: any) {
    if (a.time < b.time) {
      return 1;
    }
    if (a.time > b.time) {
      return -1;
    }
    return 0;
  }

  timelineEvents.sort(compare);

  // console.log("app.val", app.val);
  // console.log("asset.val", asset.val);
  // console.log("account.val", account.val);
  // debugger;

  const escrowTokenName = asset?.val?.assets[0]?.params?.name;
  const escrowTokenId = asset?.val?.assets[0]?.index;
  let escrowTokenBalance = "-";

  for (let idx = 0; idx < account?.val?.assets.length; idx++) {
    let scrutinizedAsset = account?.val?.assets[idx];
    if (scrutinizedAsset["asset-id"] === asset?.val?.assets[0]?.index) {
      // let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
      escrowTokenBalance = scrutinizedAsset?.amount;
      // console.log("assetholdinginfo = " + myassetholding);
      break;
    }
  }

  return app.error ? (
    <h1>ERROR</h1>
  ) : (
    <ErrorBoundary>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h1>Cash Buy</h1>
      </div>

      <Row>
        <Col xs={12} xl={8} className="mb-4">
          <Row>
            <Col xs={12} lg={6} className="mb-4">
              <RolesWidget
                buyer={get(app.val, "global_buyer", "Not Found")}
                seller={get(app.val, "global_seller", "Not Found")}
              />
            </Col>
            <Col xs={12} lg={6} className="mb-4">
              <EscrowWidget
                fungibleTokenName={escrowTokenName}
                fungibleTokenBalance={escrowTokenBalance}
                balance={`${get(account.val, "amount", "-")} mAlgos`}
                escrowAmount1={`${get(
                  app.val,
                  "global_escrow_payment_1",
                  "-"
                )}`}
                escrowAmount2={`${get(
                  app.val,
                  "global_escrow_payment_2",
                  "-"
                )}`}
                totalValue={`${get(app.val, "global_escrow_total", "-")}`}
              />
            </Col>
            <Col xs={12} className="mb-4">
              <TimelineWidget events={timelineEvents} />
            </Col>
            <Col xs={12} lg={6} className="mb-4">
              <FlagsWidget
                signalPullOut={`${get(
                  app.val,
                  "global_buyer_pullout_flag",
                  -1
                )}`}
                signalArbitration={`${get(app.val, "signal_arbitration", -1)}`}
                lenderApproves={`${get(app.val, "lender_approves", -1)}`}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={4}>
          <OperatorConfig />
          <ActionsWidget
            fungibleTokenId={escrowTokenId}
            creator={get(app.val, "global_creator", "Not Found")}
            buyer={get(app.val, "global_buyer", "Not Found")}
            seller={get(app.val, "global_seller", "Not Found")}
            operator={settings.selectedAccount}
            contractAddress={`${get(account.val, "address", "Not Found")}`}
            appId={Number.parseInt(id!)}
            firstEscrowAmount={get(app.val, "1st_escrow_amount", -1)}
            secondEscrowAmount={get(app.val, "2nd_escrow_amount", -1)}
          />
        </Col>
      </Row>
      <Row>
        {/* <Col xs={12} md={8} xl={8}>
          {app.val && (
            <ErrorBoundary>
              <ParsedAppGlobalState />
            </ErrorBoundary>
          )}
        </Col> */}

        {/* {account.val && !account.error && !account.loading && (
          <Col xs={12} md={8} xl={8}>
            <pre>{JSON.stringify(account.val, undefined, 2)}</pre>
          </Col>
        )} */}
      </Row>
    </ErrorBoundary>
  );
}

export default Overview_CashBuy__v1_0_0;
