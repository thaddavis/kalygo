import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faExternalLinkAlt,
  faEye,
  faTrashAlt,
  faCopy,
  faTruckLoading,
} from "@fortawesome/free-solid-svg-icons";

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
import { RoutesData } from "../../routes";
import { Buffer } from "buffer";

import { Algod } from "../../services/algod";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store/store";

import { showErrorToast } from "../../utility/errorToast";

export const CreatedAppsTable = () => {
  const settings = useAppSelector((state: RootState) => state.settings);

  let navigate = useNavigate();

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

  interface TR {
    id: string;
    "tx-type": string;
    "round-time": number;
    "confirmed-round": number;
    meta: string;
    note: string;
    "created-application-index"?: number;
    "created-asset-index"?: number;
    "payment-transaction"?: {
      amount: number;
    };
    "application-transaction"?: {
      "application-id": number;
      "application-args": string[];
      "on-completion"?: string;
    };
    "asset-transfer-transaction"?: {
      amount: number;
      "asset-id": number;
    };
    "asset-config-transaction"?: {
      "asset-id": number;
      params?: {
        name: string;
      };
    };
  }

  const TableRow = (props: TR) => {
    // console.log("---", props);

    const {
      id,
      "application-transaction": applicationTransaction,
      "payment-transaction": paymentTransaction,
      "asset-transfer-transaction": assetTransferTransaction,
      "asset-config-transaction": assetConfigTransaction,
      "tx-type": txType,
      "round-time": roundTime,
      "confirmed-round": confirmedRound,
      note,
      "created-application-index": createdApplicationIndex,
      "created-asset-index": createdAssetIndex,
    } = props;

    let meta;
    let arg;

    switch (txType) {
      case "appl":
        meta = `app-id: ${applicationTransaction!["application-id"]}`;

        if (
          applicationTransaction!["application-args"] &&
          applicationTransaction!["application-args"][0] &&
          applicationTransaction!["application-id"] > 0 &&
          [
            "signal_pull_out",
            "signal_arbitration",
            "buyer_withdraw_funds",
            "seller_withdraw_funds",
            "arbiter_withdraw_funds",
            "fund_contract",
            "fund_minimum_balance",
          ].includes(
            Buffer.from(
              applicationTransaction!["application-args"][0],
              "base64"
            ).toString()
          )
        ) {
          arg = `${Buffer.from(
            applicationTransaction!["application-args"][0],
            "base64"
          ).toString()}`;
        } else if (applicationTransaction!["on-completion"] === "update") {
          arg = `UPDATE contract`;
        } else if (applicationTransaction!["on-completion"] === "delete") {
          arg = `DELETE contract`;
        } else if (
          createdApplicationIndex &&
          applicationTransaction!["application-id"] === 0
        ) {
          arg = `CREATE contract`;
        } else {
          arg = ``;
        }

        break;
      case "pay":
        meta = `${paymentTransaction!["amount"]} mAlgos`;

        if (
          note &&
          Buffer.from(note, "base64").toString() &&
          ["Fund Contract Minimum 100,000 mAlgos"].includes(
            Buffer.from(note, "base64").toString()
          )
        ) {
          arg = Buffer.from(note, "base64").toString();
        } else {
          arg = ``;
        }

        break;
      case "axfer":
        meta = `${Buffer.from(note, "base64").toString()}`;

        if (assetTransferTransaction!["asset-id"]) {
          arg = `asset-id: ${assetTransferTransaction!["asset-id"]}`;
        } else {
          arg = ``;
        }
        break;
      case "acfg":
        console.log("*** acfg ***", assetConfigTransaction);
        meta = `asset-id: ${createdAssetIndex}`;

        if (assetConfigTransaction!.params?.name) {
          arg = `asset-id: ${assetConfigTransaction!.params?.name}`;
        } else {
          arg = ``;
        }

        break;
      default:
        meta = "";
    }

    return (
      <tr>
        <td>
          {id.substring(0, 8)}
          &nbsp;
          <FontAwesomeIcon
            color="black"
            icon={faCopy}
            onClick={() => {
              navigator.clipboard.writeText(id);
            }}
          />
        </td>
        <td>
          <span className="fw-normal">{txType}</span>
        </td>
        <td>
          <span className="fw-normal">
            {new Date(roundTime * 1000).toLocaleString()}
          </span>
        </td>
        <td>
          <span className="fw-normal">{confirmedRound}</span>
        </td>
        <td>
          <span className="fw-normal">{meta}</span>
        </td>
        <td>
          <span className="fw-normal">{arg}</span>
        </td>
        <td>
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle
              as={Button}
              split
              variant="link"
              className="text-dark m-0 p-0"
            >
              <span className="icon icon-sm">
                <FontAwesomeIcon icon={faEllipsisH} className="icon-dark" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {txType === "appl" &&
                (applicationTransaction!["application-id"] ||
                  createdApplicationIndex) && (
                  <Dropdown.Item
                    onClick={() => {
                      navigate(
                        `/dashboard/transactions/app/${
                          applicationTransaction!["application-id"] ||
                          createdApplicationIndex
                        }`
                      );
                    }}
                  >
                    <FontAwesomeIcon icon={faEye} className="me-2" /> View
                    Contract
                  </Dropdown.Item>
                )}
              {txType === "acfg" && assetConfigTransaction && (
                <Dropdown.Item
                  onClick={() => {
                    navigate(
                      `/dashboard/transactions/asset/${createdAssetIndex}`
                    );
                  }}
                >
                  <FontAwesomeIcon icon={faEye} className="me-2" /> View holders
                </Dropdown.Item>
              )}
              <Dropdown.Item
                onClick={() => {
                  navigate(`/dashboard/transactions/detail/${id}`);
                }}
              >
                <FontAwesomeIcon icon={faEye} className="me-2" /> View Txn
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    );
  };

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
          {/* <Nav>
            <Pagination className="mb-2 mb-lg-0">
              <Pagination.Prev>Previous</Pagination.Prev>
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Item>2</Pagination.Item>
              <Pagination.Next>Next</Pagination.Next>
            </Pagination>
          </Nav> */}
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
