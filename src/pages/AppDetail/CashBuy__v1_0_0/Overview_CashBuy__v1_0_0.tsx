import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import get from "lodash/get";

import { Col, Row, Button, Dropdown } from "react-bootstrap";
import { SettingsForm } from "../../../components/Forms/SettingsForm";

import { RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { OperatorConfig } from "../../../components/Widgets/Generic/OperatorConfig";
import { Algod } from "../../../services/algod";
import { useParams } from "react-router-dom";
import { parseGlobalState } from "../../customSelectors/appl/parseGlobalState";
import { ErrorBoundary } from "../../../components/ErrorBoundary";
import { RolesWidget } from "../../../components/Widgets/CashBuy__v1_0_0/RolesWidget";
import { TimelineWidget } from "../../../components/Widgets/CashBuy__v1_0_0/TimelineWidget";
import { FlagsWidget } from "../../../components/Widgets/CashBuy__v1_0_0/FlagsWidget";
import { EscrowWidget } from "../../../components/Widgets/CashBuy__v1_0_0/EscrowWidget";

import algosdk from "algosdk";
import { ActionsWidget } from "../../../components/Widgets/CashBuy__v1_0_0/ActionsWidget";
import { prepareTimelineEventsArray } from "./helpers/prepareTimelineEventsArray";

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

  let timelineEvents = app
    ? prepareTimelineEventsArray(app)
    : {
        timeline: [],
        now: new Date().getTime(),
        inspectionPeriodEnd: new Date().getTime(),
        closingDate: new Date().getTime(),
        movingDate: new Date().getTime(),
      };

  console.log("app.val", app.val);
  // console.log("asset.val", asset.val);
  // console.log("account.val", account.val);
  // debugger;

  const escrowTokenName = asset?.val?.assets[0]?.params?.name;
  const escrowTokenId = asset?.val?.assets[0]?.index;
  let escrowTokenBalance = -1;

  for (let idx = 0; idx < account?.val?.assets.length; idx++) {
    let scrutinizedAsset = account?.val?.assets[idx];
    if (scrutinizedAsset["asset-id"] === asset?.val?.assets[0]?.index) {
      escrowTokenBalance = scrutinizedAsset?.amount;
      break;
    }
  }

  // console.log("escrowTokenBalance", escrowTokenBalance);

  return app.error ? (
    <h1>ERROR</h1>
  ) : (
    <ErrorBoundary>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h1>Cash Buy</h1>
      </div>

      <Row>
        <Col xs={12} xl={4}>
          <OperatorConfig />
          <ActionsWidget
            now={timelineEvents.now}
            inspectionPeriodEnd={timelineEvents.inspectionPeriodEnd}
            closingDate={timelineEvents.closingDate}
            movingDate={timelineEvents.movingDate}
            fungibleTokenId={escrowTokenId}
            fungibleTokenBalance={escrowTokenBalance}
            balance={get(account.val, "amount", 0)}
            creator={get(app.val, "global_creator", "Not Found")}
            buyer={get(app.val, "global_buyer", "Not Found")}
            seller={get(app.val, "global_seller", "Not Found")}
            operator={settings.selectedAccount}
            contractAddress={`${get(account.val, "address", "Not Found")}`}
            appId={Number.parseInt(id!)}
            firstEscrowAmount={get(app.val, "global_escrow_payment_1", -1)}
            secondEscrowAmount={get(app.val, "global_escrow_payment_2", -1)}
            buyerPulloutFlag={get(app.val, "global_buyer_pullout_flag", -1)}
            buyerArbitrationFlag={get(
              app.val,
              "global_buyer_arbitration_flag",
              -1
            )}
            sellerArbitrationFlag={get(
              app.val,
              "global_seller_arbitration_flag",
              -1
            )}
          />
        </Col>
        <Col xs={12} xl={8} className="mb-4">
          <Row>
            <Col xs={12} lg={6} className="mb-4">
              <EscrowWidget
                now={timelineEvents.now}
                inspectionPeriodEnd={timelineEvents.inspectionPeriodEnd}
                closingDate={timelineEvents.closingDate}
                fungibleTokenName={escrowTokenName}
                fungibleTokenBalance={escrowTokenBalance}
                balance={get(account.val, "amount", -1)}
                escrowAmount1={get(app.val, "global_escrow_payment_1", -1)}
                escrowAmount2={get(app.val, "global_escrow_payment_2", -1)}
                totalValue={get(app.val, "global_escrow_total", -1)}
              />
            </Col>
            <Col xs={12} lg={6} className="mb-4">
              <FlagsWidget
                signalPullOut={get(app.val, "global_buyer_pullout_flag", -1)}
                signalBuyerArbitration={get(
                  app.val,
                  "global_buyer_arbitration_flag",
                  -1
                )}
                signalSellerArbitration={get(
                  app.val,
                  "global_seller_arbitration_flag",
                  -1
                )}
              />
            </Col>
            <Col xs={12} className="mb-4">
              <TimelineWidget events={get(timelineEvents, "timeline", [])} />
            </Col>
            <Col xs={12} className="mb-4">
              <RolesWidget
                creator={get(app.val, "global_creator", "Not Found")}
                buyer={get(app.val, "global_buyer", "Not Found")}
                seller={get(app.val, "global_seller", "Not Found")}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </ErrorBoundary>
  );
}

export default Overview_CashBuy__v1_0_0;
