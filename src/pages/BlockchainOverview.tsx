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
import { EthereumClient } from "../services/ethereum_client";

const BlockchainOverview = () => {
  const [statusAlgorand, setStatusAlgorand] = useState<any>({
    val: "...",
    loading: true,
    error: undefined,
  });
  const [statusEthereum, setStatusEthereum] = useState<any>({
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

        if (settings.selectedBlockchain === "Ethereum") {
          const web3 = await EthereumClient.getEthereumClient(
            settings.selectedEthereumNetwork
          );

          // console.log(web3);

          let response = await web3.eth.getBlockNumber();

          // console.log("response", response);

          // .status()
          // .do();

          setStatusEthereum({
            val: response,
            loading: false,
            error: null,
          });
        } else if (settings.selectedBlockchain === "Algorand") {
          const response = await Algod.getAlgod(
            settings.selectedAlgorandNetwork
          )
            .status()
            .do();

          setStatusAlgorand({
            val: response,
            loading: false,
            error: null,
          });
        }
      } catch (e) {
        console.error("e", e);

        showErrorToast("Error occurred while fetching network status");

        if (settings.selectedBlockchain === "Ethereum") {
          setStatusEthereum({
            val: null,
            loading: false,
            error: e,
          });
        } else if (settings.selectedBlockchain === "Algorand") {
          setStatusAlgorand({
            val: null,
            loading: false,
            error: e,
          });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  });

  return (
    <>
      <Row className="justify-content-md-center py-4">
        <Col className="mb-4">
          {/* <h1>{settings.selectedBlockchain}</h1> */}
          <h1>Ethereum</h1>
          {settings.selectedBlockchain === "Ethereum" && (
            <h3>Network: {settings.selectedEthereumNetwork}</h3>
          )}
          {settings.selectedBlockchain === "Algorand" && (
            <h3>Network: Mainnet</h3>
            // <h3>Network: {settings.selectedAlgorandNetwork}</h3>
          )}
        </Col>
      </Row>

      {/* {status?.loading ? "..." : <br />} */}

      {settings.selectedBlockchain === "Algorand" && (
        <Row className="justify-content-md-center py-4">
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <BlockchainStatWidget
              field="Last Block"
              value={statusAlgorand?.val && statusAlgorand?.val["last-round"]}
              loading={statusAlgorand?.loading}
            />
          </Col>
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <BlockchainStatWidget
              field="Last Block Time"
              value={
                statusAlgorand?.val &&
                statusAlgorand?.val["time-since-last-round"]
                  ? new Date().toLocaleTimeString()
                  : ""
              }
              loading={statusAlgorand?.loading}
            />
          </Col>
        </Row>
      )}

      {settings.selectedBlockchain === "Ethereum" && (
        <Row className="justify-content-md-center py-4">
          <Col xs={12} sm={6} xl={4} className="mb-4">
            <BlockchainStatWidget
              field="Last Block"
              value={statusEthereum?.val}
              loading={statusEthereum?.loading}
            />
          </Col>
          {/* <Col xs={12} sm={6} xl={4} className="mb-4">
            <BlockchainStatWidget
              field="Last Block Time"
              value={
                statusEthereum?.val &&
                statusEthereum?.val["time-since-last-round"]
                  ? new Date().toLocaleTimeString()
                  : ""
              }
              loading={statusAlgorand?.loading}
            />
          </Col> */}
        </Row>
      )}

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
