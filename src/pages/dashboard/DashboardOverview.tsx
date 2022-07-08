import React, { useEffect, useState } from "react";
import { faCashRegister, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "react-bootstrap";
import algosdk from "algosdk";
import { totalOrders } from "../../data/charts";
import { CounterWidget } from "../../components/Widgets";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { Algod } from "../../services/algod";
import { RootState } from "../../store/store";

import { showErrorToast } from "../../utility/errorToast";

const DashboardOverview = () => {
  const [status, setStatus] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  const settings = useAppSelector((state: RootState) => state.settings);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        setStatus({
          val: status.val,
          loading: true,
          error: null,
        });

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
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <>
      <Row className="justify-content-md-center py-4">
        <Col className="mb-4">
          <h1>Network Status</h1>
          <h2>{settings.selectedNetwork}</h2>
        </Col>
      </Row>

      {status?.loading ? "..." : <br />}

      <Row className="justify-content-md-center py-4">
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Last Round"
            title={status?.val && status?.val["last-round"]}
            period=""
            percentage={18.2}
            icon={faChartLine}
            iconColor="shape-secondary"
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="Last Round Time"
            title={
              status?.val && status?.val["time-since-last-round"]
                ? new Date().toLocaleTimeString()
                : ""
            }
            period=""
            percentage={28.4}
            icon={faCashRegister}
            iconColor="shape-tertiary"
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

export default DashboardOverview;
