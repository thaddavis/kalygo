import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEye, faCopy } from "@fortawesome/free-solid-svg-icons";
import { Buffer } from "buffer";

import { Button, Dropdown, ButtonGroup } from "react-bootstrap";
import { supportedContracts } from "../../../data/supportedContracts";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../../utility/errorToast";
interface TR {
  address: string;
  deleted: boolean;
  "is-frozen": boolean;
  amount: number;
  "opted-in-at-round": number;
}

export const HoldersTableRow = (props: TR) => {
  let navigate = useNavigate();

  // console.log("---", props);

  let {
    address,
    amount,
    "opted-in-at-round": optedInAtRound,
    "is-frozen": isFrozen,
    deleted,
  } = props;

  return (
    <tr>
      <td>
        {address.substring(0, 8)}
        &nbsp;
        <FontAwesomeIcon
          color="black"
          icon={faCopy}
          onClick={() => {
            navigator.clipboard.writeText(address);
          }}
        />
      </td>
      <td>
        <span className="fw-normal">{amount}</span>
      </td>
      <td>
        <span className="fw-normal">{deleted ? "True" : "False"}</span>
      </td>
      <td>
        <span className="fw-normal">{isFrozen ? "True" : "False"}</span>
      </td>
      {/* <td>
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
            <Dropdown.Item onClick={() => {}}>
              <FontAwesomeIcon icon={faEye} className="me-2" />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td> */}
    </tr>
  );
};
