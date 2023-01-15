import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEye, faCopy } from "@fortawesome/free-solid-svg-icons";
import { Buffer } from "buffer";

import { Button, Dropdown, ButtonGroup } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

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

export const TableRow = (props: TR) => {
  let navigate = useNavigate();

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
      // meta = `${Buffer.from(note, "base64").toString()}`;
      meta = `${assetTransferTransaction?.amount}`;

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
