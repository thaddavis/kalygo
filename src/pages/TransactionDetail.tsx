import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCartArrowDown,
  faChartPie,
  faChevronDown,
  faClipboard,
  faCommentDots,
  faFileAlt,
  faPlus,
  faRocket,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Button, Dropdown } from "react-bootstrap";
import { SettingsForm } from "../components/Forms/SettingsForm";

import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { OperatorConfig } from "../components/Widgets/Generic/OperatorConfig";
import { Algod } from "../services/algod";
import { useParams } from "react-router-dom";

function TransactionDetail() {
  const [txn, setTxn] = useState<any>({
    transactions: [],
  });

  const settings = useAppSelector((state: RootState) => state.settings);

  let { id } = useParams();

  useEffect(() => {
    async function fetch() {
      try {
        const txnResponse = await Algod.getIndexer(settings.selectedNetwork)
          .lookupTransactionByID(id!)
          .do();

        console.log("txnResponse", txnResponse);
        setTxn(txnResponse);
      } catch (e) {}
    }

    fetch();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4"></div>

      <Row>
        <Col>
          {/* <SettingsForm accounts={settings.accounts} /> */}
          {txn && (
            <code>
              <pre
                className={"truncate"}
                style={{
                  overflowX: "hidden",
                }}
              >
                {JSON.stringify(txn, undefined, 2)}
              </pre>
            </code>
          )}
        </Col>
      </Row>
    </>
  );
}

export default TransactionDetail;
