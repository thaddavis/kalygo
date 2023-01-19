import React, { useEffect, useState } from "react";
import {
  faCashRegister,
  faChartLine,
  faTruckLoading,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "react-bootstrap";
import algosdk from "algosdk";
import { totalOrders } from "../data/charts";
import { CounterWidget } from "../components/Widgets";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { Algod } from "../services/algod";
import { RootState } from "../store/store";

import { showErrorToast } from "../utility/errorToast";
import { BlockchainStatWidget } from "../components/Widgets/Generic/BlockchainStat";

const BlockchainOverview = () => {
  const [status, setStatus] = useState<any>({
    val: "...",
    loading: true,
    error: undefined,
  });
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  const settings = useAppSelector((state: RootState) => state.settings);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // setStatus({
        //   val: status.val,
        //   loading: true,
        //   error: null,
        // });

        const response = await Algod.getAlgod(settings.selectedNetwork)
          .status()
          .do();

        setStatus({
          val: response,
          loading: false,
          error: null,
        });
      } catch (e) {
        console.error("e", e);

        showErrorToast("Error occurred while fetching network status");

        setStatus({
          val: null,
          loading: false,
          error: e,
        });
      }
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <>
      <Row className="justify-content-md-center py-4">
        <Col className="mb-4">
          <h1>{settings.selectedBlockchain}</h1>
          <h3>Network: {settings.selectedNetwork}</h3>
        </Col>
      </Row>

      {/* {status?.loading ? "..." : <br />} */}

      <Row className="justify-content-md-center py-4">
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <BlockchainStatWidget
            field="Last Block"
            value={status?.val && status?.val["last-round"]}
            loading={status?.loading}
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <BlockchainStatWidget
            field="Last Block Time"
            value={
              status?.val && status?.val["time-since-last-round"]
                ? new Date().toLocaleTimeString()
                : ""
            }
            loading={status?.loading}
          />
        </Col>
      </Row>

      {/* <Row>
        {status.val && !status.error && !status.loading && (
          <Col xs={12} md={8} xl={8}>
            <pre>{JSON.stringify(status.val, undefined, 2)}</pre>
          </Col>
        )}
      </Row> */}
    </>
  );
};

export default BlockchainOverview;
