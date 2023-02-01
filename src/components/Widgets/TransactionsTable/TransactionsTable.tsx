import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckLoading } from "@fortawesome/free-solid-svg-icons";

import {
  Nav,
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

import get from "lodash/get";

import { useNavigate } from "react-router-dom";
import { RoutesData } from "../../../routes";

import { Algod } from "../../../services/algod";
import { useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store/store";

import { showErrorToast } from "../../../utility/errorToast";

import { TableRow } from "./TableRow";

async function fetchTxns(
  nextToken: string,
  settingsState: any,
  accountTxnsStateSetter: any
) {
  try {
    console.log("__fetchTxns__");

    const accountTxnsResponse = await Algod.getIndexer(
      settingsState.selectedAlgorandNetwork
    )
      .lookupAccountTransactions(settingsState.selectedAlgorandAccount)
      .limit(21)
      .nextToken(nextToken)
      .do();

    console.log("accountTxnsResponse", accountTxnsResponse);
    accountTxnsStateSetter({
      val: accountTxnsResponse,
      loading: false,
      error: null,
    });
  } catch (e) {
    console.error(e);
    accountTxnsStateSetter({
      val: null,
      loading: false,
      error: e,
    });
    showErrorToast("Error occurred while fetching transaction history");
  }
}

export const TransactionsTable = () => {
  const settings = useAppSelector((state: RootState) => state.settings);

  let navigate = useNavigate();

  const [accountTxns, setAccountTxns] = useState<any>({
    val: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    fetchTxns("", settings, setAccountTxns);
  }, []);

  const totalTransactions = accountTxns?.val?.transactions?.length || 0;

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
            {accountTxns?.val?.transactions?.map((t: any) => {
              return <TableRow key={`transaction-${t.id}`} {...t} />;
            })}
          </tbody>
        </Table>
        <Card.Footer className="px-3 border-0 d-lg-flex align-items-center justify-content-between">
          <Nav>
            <Pagination className="mb-2 mb-lg-0">
              <Pagination.Next
                onClick={() => {
                  fetchTxns(
                    get(accountTxns, "val.next-token", ""),
                    settings,
                    setAccountTxns
                  );
                }}
              >
                Next
              </Pagination.Next>
            </Pagination>
          </Nav>
          <small className="fw-bold">
            Showing <b>{totalTransactions}</b> entries
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
