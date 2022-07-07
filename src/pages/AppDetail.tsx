import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import get from "lodash/get";

import { Col, Row, Button, Dropdown } from "react-bootstrap";
import { SettingsForm } from "../components/Forms/SettingsForm";

import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { WidgetB } from "../components/Widgets/WidgetB";
import { Algod } from "../services/algod";
import { useParams } from "react-router-dom";
import { parseGlobalState } from "./customSelectors/appl/parseGlobalState";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { EscrowContractRolesWidgetC } from "../components/Widgets/WidgetC";
import { EscrowContractTimelineWidget } from "../components/Widgets/WidgetD";
import { EscrowContractAmountsWidget } from "../components/Widgets/WidgetE";
import { EscrowContractFlagsWidget } from "../components/Widgets/WidgetF";

import algosdk from "algosdk";
import { ActionsWidget } from "../components/Widgets/WidgetG";

function AppDetail() {
  const [app, setApp] = useState<any>({
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

  useEffect(() => {
    async function fetch() {
      try {
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

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
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

        const accountResponse = await Algod.getAlgod(settings.selectedNetwork)
          .accountInformation(appAddress)
          .do();

        setAccount({
          val: accountResponse,
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetch() {
      try {
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

        const accountResponse = await Algod.getAlgod(settings.selectedNetwork)
          .accountInformation(appAddress)
          .do();

        setAccount({
          val: accountResponse,
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
      time: new Date(get(app, "val.closing_date", 0) * 1000).getTime(),
      color: "green",
    },
    {
      title: "Inspection Ends",
      time: new Date(get(app, "val.inspection_end", 0) * 1000).getTime(),
      color: "orange",
    },
    {
      title: "Inspection Begins",
      time: new Date(get(app, "val.inspection_begin", 0) * 1000).getTime(),
      color: "red",
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

  return (
    <ErrorBoundary>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4"></div>

      <Row>
        <Col xs={12} xl={8} className="mb-4">
          <Row>
            <Col xs={12} lg={6} className="mb-4">
              <EscrowContractRolesWidgetC
                buyer={get(app.val, "buyer", "Not Found")}
                seller={get(app.val, "seller", "Not Found")}
                arbiter={get(app.val, "arbiter", "Not Found")}
              />
            </Col>
            <Col xs={12} lg={6} className="mb-4">
              <EscrowContractAmountsWidget
                minBalance={`${get(
                  account.val,
                  "min-balance",
                  "Not Found"
                ).toLocaleString("en-US")} mAlgos`}
                balance={`${get(
                  account.val,
                  "amount",
                  "Not Found"
                ).toLocaleString("en-US")} mAlgos`}
                escrowAmount1={`${get(
                  app.val,
                  "1st_escrow_amount",
                  "Not Found"
                ).toLocaleString("en-US")} mAlgos`}
                escrowAmount2={`${get(
                  app.val,
                  "2nd_escrow_amount",
                  "Not Found"
                ).toLocaleString("en-US")} mAlgos`}
                totalValue={`${get(
                  app.val,
                  "sale_price",
                  "Not Found"
                ).toLocaleString("en-US")} mAlgos`}
              />
            </Col>
            <Col xs={12} className="mb-4">
              <EscrowContractTimelineWidget events={timelineEvents} />
            </Col>
            <Col xs={12} lg={6} className="mb-4">
              <EscrowContractFlagsWidget
                signalPullOut={`${get(app.val, "signal_pull_out", -1)}`}
                signalArbitration={`${get(app.val, "signal_arbitration", -1)}`}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12} xl={4}>
          <WidgetB />
          <ActionsWidget
            buyer={get(app.val, "buyer", "Not Found")}
            seller={get(app.val, "seller", "Not Found")}
            arbiter={get(app.val, "arbiter", "Not Found")}
            creator={get(app.val, "creator", "Not Found")}
            operator={settings.selectedAccount}
            contractAddress={`${get(account.val, "address", "Not Found")}`}
            appId={Number.parseInt(id!)}
            firstEscrowAmount={get(app.val, "1st_escrow_amount", -1)}
            secondEscrowAmount={get(app.val, "2nd_escrow_amount", -1)}
          />
        </Col>
      </Row>
      <Row>
        {/* 
        <Col xs={12} md={8} xl={8}>
          {app.val && (
            <ErrorBoundary>
              <ParsedAppGlobalState />
            </ErrorBoundary>
          )}
        </Col>
        */}
        {/* {account.val && !account.error && !account.loading && (
          <Col xs={12} md={8} xl={8}>
            <pre>{JSON.stringify(account.val, undefined, 2)}</pre>
          </Col>
        )} */}
      </Row>
    </ErrorBoundary>
  );
}

export default AppDetail;
