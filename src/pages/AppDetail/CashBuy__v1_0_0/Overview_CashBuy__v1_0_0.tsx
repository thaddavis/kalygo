import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import get from "lodash/get";

import { useForm } from "react-hook-form";
import { Col, Row, Button, Dropdown, Modal } from "react-bootstrap";
import { Buffer } from "buffer";

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
import { UpdateContractWidget } from "../../../components/Widgets/CashBuy__v1_0_0/UpdateContractWidget";

import algosdk from "algosdk";
import { ActionsWidget } from "../../../components/Widgets/CashBuy__v1_0_0/ActionsWidget";
import { prepareTimelineEventsArray } from "./helpers/prepareTimelineEventsArray";
import { RoleBoxWidget } from "../../../components/Widgets/CashBuy__v1_0_0/RoleBoxWidget";
import { arrayBufferToString } from "./helpers/arrayBufferToString";

async function fetchTxnHistory(network: string, app_address: string) {
  try {
    // console.log("fetch");

    let txnHistoryForContract = await Algod.getIndexer(
      // settings.selectedAlgorandNetwork
      network
    )
      .searchForTransactions()
      .address(
        // id!
        app_address
      )
      .limit(25)
      // .nextToken("1wYAAAAAAAAAAAAA")
      // .txType("appl")
      .do();

    console.log("=> Txn History =>", txnHistoryForContract);

    // setValue("note", arrayBufferToString(boxValue.value).trimEnd());
  } catch (e) {
    console.log("* e *", e);
    // setValue("note", "");
  }
}

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

  const [showNoteModal, setShowNoteModal] = useState(false);
  const handleClose = () => setShowNoteModal(false);
  const handleShow = () => setShowNoteModal(true);

  const settings = useAppSelector((state: RootState) => state.settings);

  let { id } = useParams();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // STEP 1
        const appResponse = await Algod.getIndexer(
          settings.selectedAlgorandNetwork
        )
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
        const accountResponse = await Algod.getAlgod(
          settings.selectedAlgorandNetwork
        )
          .accountInformation(appAddress)
          .do();
        setAccount({
          val: accountResponse,
          loading: false,
          error: null,
        });
        // STEP 3
        fetchTxnHistory(settings.selectedAlgorandNetwork, appAddress);
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
        const appResponse = await Algod.getIndexer(
          settings.selectedAlgorandNetwork
        )
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
        const accountResponse = await Algod.getAlgod(
          settings.selectedAlgorandNetwork
        )
          .accountInformation(appAddress)
          .do();

        setAccount({
          val: accountResponse,
          loading: false,
          error: null,
        });

        const parsedGlobalState = parseGlobalState(
          appResponse?.application?.params &&
            appResponse.application.params["global-state"]
        );

        // STEP 3
        let assetInfo = await Algod.getIndexer(settings.selectedAlgorandNetwork)
          .searchForAssets()
          .index(parsedGlobalState["glbl_asa_id"])
          .do();

        setAsset({
          val: assetInfo,
          loading: false,
          error: null,
        });
      } catch (e) {
        console.log("e", e);

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
        inspectPeriodStart: new Date().getTime(),
        inspectPeriodEnd: new Date().getTime(),
        inspectExtension: new Date().getTime(),
        movingDate: new Date().getTime(),
        closingDate: new Date().getTime(),
        freeFundsDate: new Date().getTime(),
      };

  // console.log("app.val", app.val);
  // console.log("asset.val", asset.val);
  // console.log("account.val", account.val);
  // console.log("boxes.val", boxes.val);
  // debugger;

  const escrowTokenName = asset?.val?.assets[0]?.params?.name;
  const escrowTokenDecimals = asset?.val?.assets[0]?.params?.decimals;
  const escrowTokenId = asset?.val?.assets[0]?.index;
  let escrowTokenBalance = -1;

  for (let idx = 0; idx < account?.val?.assets.length; idx++) {
    let scrutinizedAsset = account?.val?.assets[idx];
    if (scrutinizedAsset["asset-id"] === asset?.val?.assets[0]?.index) {
      escrowTokenBalance = scrutinizedAsset?.amount;
      break;
    }
  }

  console.log("app --->>>", app);
  console.log("account --->>>", account);
  console.log("asset --->>>", asset);

  return app.error ? (
    <h1>ERROR</h1>
  ) : (
    <ErrorBoundary>
      <div className="d-flex flex-column flex-wrap flex-md-nowrap align-items-center py-4">
        <h1>Cash Buy</h1>
        {/* <h6>{get(account, "val.address", "")}</h6> */}
      </div>

      <Row>
        <Col xs={12} xl={4}>
          <OperatorConfig />
          <ActionsWidget
            now={timelineEvents.now}
            inspectPeriodStart={timelineEvents.inspectPeriodStart}
            inspectPeriodEnd={timelineEvents.inspectPeriodEnd}
            inspectPeriodExtension={timelineEvents.inspectExtension}
            closingDate={timelineEvents.closingDate}
            freeFundsDate={timelineEvents.freeFundsDate}
            movingDate={timelineEvents.movingDate}
            fungibleTokenId={escrowTokenId}
            fungibleTokenBalance={escrowTokenBalance}
            balance={get(account.val, "amount", 0)}
            stablecoinIssuerClawbackAddress={get(
              asset.val,
              "assets.0.params.clawback",
              "Not Found"
            )}
            buyer={get(app.val, "glbl_buyer", "Not Found")}
            seller={get(app.val, "glbl_seller", "Not Found")}
            operator={settings.selectedAlgorandAccount}
            contractAddress={`${get(account.val, "address", "Not Found")}`}
            appId={Number.parseInt(id!)}
            firstEscrowAmount={get(app.val, "glbl_escrow_1", -1)}
            secondEscrowAmount={get(app.val, "glbl_escrow_2", -1)}
            buyerPulloutFlag={get(app.val, "glbl_buyer_pullout_flag", -1)}
            buyerArbitrationFlag={get(
              app.val,
              "glbl_buyer_arbitration_flag",
              -1
            )}
            sellerArbitrationFlag={get(
              app.val,
              "glbl_seller_arbitration_flag",
              -1
            )}
            showNoteModal={handleShow}
          />
          <RoleBoxWidget
            rolesWithBoxes={{
              Buyer: get(app.val, "glbl_buyer", "Not Found"),
              Seller: get(app.val, "glbl_seller", "Not Found"),
              Arbiter: get(asset.val, "assets.0.params.clawback", "Not Found"),
            }}
            appAddress={get(account.val, "address")}
            boxKey={"Buyer"}
            appId={Number.parseInt(id!)}
          ></RoleBoxWidget>
          <RoleBoxWidget
            rolesWithBoxes={{
              Buyer: get(app.val, "glbl_buyer", "Not Found"),
              Seller: get(app.val, "glbl_seller", "Not Found"),
              Arbiter: get(asset.val, "assets.0.params.clawback", "Not Found"),
            }}
            appAddress={get(account.val, "address")}
            boxKey={"Seller"}
            appId={Number.parseInt(id!)}
          ></RoleBoxWidget>
          <UpdateContractWidget appId={Number.parseInt(id!)} />
        </Col>
        <Col xs={12} xl={8} className="mb-4">
          <Row>
            <Col xs={12} lg={6} className="mb-4">
              <EscrowWidget
                now={timelineEvents.now}
                inspectPeriodEnd={timelineEvents.inspectPeriodEnd}
                closingDate={timelineEvents.closingDate}
                fungibleTokenName={escrowTokenName}
                fungibleTokenBalance={escrowTokenBalance}
                fungibleTokenDecimals={escrowTokenDecimals}
                balance={get(account.val, "amount", -1)}
                escrowAmount1={get(app.val, "glbl_escrow_1", -1)}
                escrowAmount2={get(app.val, "glbl_escrow_2", -1)}
                totalValue={get(app.val, "glbl_total", -1)}
              />
            </Col>
            <Col xs={12} lg={6} className="mb-4">
              <FlagsWidget
                buyerPullout={get(app.val, "glbl_buyer_pullout_flag", -1)}
                buyerArbitration={get(
                  app.val,
                  "glbl_buyer_arbitration_flag",
                  -1
                )}
                sellerArbitration={get(
                  app.val,
                  "glbl_seller_arbitration_flag",
                  -1
                )}
              />
            </Col>
            <Col xs={12} className="mb-4">
              <TimelineWidget events={get(timelineEvents, "timeline", [])} />
            </Col>
            <Col xs={12} className="mb-4">
              <RolesWidget
                buyer={get(app.val, "glbl_buyer", "Not Found")}
                seller={get(app.val, "glbl_seller", "Not Found")}
                clawbackAddress={get(
                  asset.val,
                  "assets.0.params.clawback",
                  "Not Found"
                )}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </ErrorBoundary>
  );
}

export default Overview_CashBuy__v1_0_0;
