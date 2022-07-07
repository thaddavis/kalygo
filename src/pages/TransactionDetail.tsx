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
import { WidgetB } from "../components/Widgets/WidgetB";
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
        <Col xs={12} xl={4}>
          <WidgetB />
        </Col>
        <Col xs={12} md={8} xl={8}>
          {/* <SettingsForm accounts={settings.accounts} /> */}
          {txn && <pre>{JSON.stringify(txn, undefined, 2)}</pre>}
        </Col>
      </Row>
    </>
  );
}

export default TransactionDetail;
