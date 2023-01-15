import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckLoading } from "@fortawesome/free-solid-svg-icons";

import {
  Card,
  Image,
  Button,
  Table,
  Dropdown,
  ProgressBar,
  Pagination,
  ButtonGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { RoutesData } from "../../../routes";

import { Algod } from "../../../services/algod";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";

import { showErrorToast } from "../../../utility/errorToast";

import { TableRow } from "./TableRow";

export const TransactionsTable = () => {
  const settings = useAppSelector((state: RootState) => state.settings);

  const [accountTxns, setAccountTxns] = useState<any>({
    transactions: [],
  });

  useEffect(() => {
    async function fetch() {
      try {
        const accountTxnsResponse = await Algod.getIndexer(
          settings.selectedNetwork
        )
          .lookupAccountTransactions(settings.selectedAccount)
          .limit(21)
          .do();

        console.log("accountTxnsResponse", accountTxnsResponse);
        setAccountTxns(accountTxnsResponse);
      } catch (e) {
        console.error(e);
        showErrorToast("Error occurred while fetching transaction history");
      }
    }

    fetch();
  }, []);

  const totalTransactions = accountTxns?.transactions?.length || 0;

  return totalTransactions > 0 ? (
    <Card border="light" className="table-wrapper table-responsive shadow-sm">
      <Card.Body className="pt-0">
        <Table hover className="user-table align-items-center">
          <thead>
            <tr>
              <th className="border-bottom">Id</th>
              <th className="border-bottom">Type</th>
              <th className="border-bottom">Time</th>
              <th className="border-bottom">Round</th>
              <th className="border-bottom">Meta</th>
              <th className="border-bottom">Arg</th>
              <th className="border-bottom">Action</th>
            </tr>
          </thead>
          <tbody>
            {accountTxns?.transactions.map((t: any) => {
              return <TableRow key={`transaction-${t.id}`} {...t} />;
            })}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          {/* <Nav> */}
          {/* <Pagination className="mb-2 mb-lg-0">
            <Pagination.Prev>Previous</Pagination.Prev>
            <Pagination.Item active>1</Pagination.Item>
            <Pagination.Item>2</Pagination.Item>
            <Pagination.Next>Next</Pagination.Next>
          </Pagination> */}
          {/* </Nav> */}
          <small className="fw-bold">
            Showing <b>{totalTransactions}</b> out of <b>{totalTransactions}</b>{" "}
            entries
          </small>
        </Card.Footer>
      </Card.Body>
    </Card>
  ) : (
    <FontAwesomeIcon
      className="d-block mx-auto"
      color="black"
      icon={faTruckLoading}
    />
  );
};
