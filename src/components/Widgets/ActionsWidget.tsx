import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Row,
  Card,
  Image,
  Button,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import {
  CircleChart,
  BarChart,
  SalesValueChart,
  SalesValueChartphone,
} from "../Charts";

import Profile1 from "../../assets/img/team/profile-picture-1.jpg";
import ProfileCover from "../../assets/img/profile-cover.jpg";

import teamMembers from "../../data/teamMembers";
import { RootState } from "../../store/store";
import { useAppSelector } from "../../store/hooks";
import { fundMinimumBalance } from "../../contractActions/fundMinimumBalance";
import { firstEscrowAmount } from "../../contractActions/1stEscrowAmount";
import { secondEscrowAmount } from "../../contractActions/2ndEscrowAmount";
import { signalPullOut } from "../../contractActions/signalPullOut";
import { signalArbitration } from "../../contractActions/signalArbitration";
import { buyerWithdrawEscrow } from "../../contractActions/buyerWithdrawEscrow";
import { deleteApp } from "../../contractActions/deleteApp";
import { sendHoldingsToBuyer } from "../../contractActions/sendHoldingsToBuyer";
import { sendHoldingsToSeller } from "../../contractActions/sendHoldingsToSeller";

interface P {
  buyer: string;
  seller: string;
  creator: string;
  arbiter: string;
  operator: string;
  lender: string;
  buyerRealtor: string;
  sellerRealtor: string;
  titleCompany: string;
  jurisdiction: string;
  contractAddress: string;
  appId: number;
  firstEscrowAmount: number;
  secondEscrowAmount: number;
}

export const ActionsWidget = (props: P) => {
  const {
    buyer,
    seller,
    creator,
    arbiter,
    operator,
    lender,
    buyerRealtor,
    sellerRealtor,
    titleCompany,
    jurisdiction,
    contractAddress,
    appId,
    firstEscrowAmount: escrowAmount1,
    secondEscrowAmount: escrowAmount2,
  } = props;

  const settings = useAppSelector((state: RootState) => state.settings);

  return (
    <Card border="light" className="text-center p-0 mb-4">
      <Card.Body className="pb-0 mb-4">
        <Card.Title>
          {operator === buyer && (
            <>
              <span>Buyer</span>
              <br />
            </>
          )}
          {operator === seller && (
            <>
              <span>Seller</span>
            </>
          )}
          {operator === arbiter && (
            <>
              <span>Arbiter</span>
            </>
          )}
          <br />
          {operator === creator && (
            <>
              <span>Creator</span>
              <br />
            </>
          )}

          {operator === lender && (
            <>
              <span>Lender</span>
              <br />
            </>
          )}

          {operator === buyerRealtor && (
            <>
              <span>Buyer Realtor</span>
              <br />
            </>
          )}

          {operator === sellerRealtor && (
            <>
              <span>Seller Realtor</span>
              <br />
            </>
          )}

          {operator === titleCompany && (
            <>
              <span>Title Company</span>
              <br />
            </>
          )}

          {operator === jurisdiction && (
            <>
              <span>Jurisdiction</span>
              <br />
            </>
          )}
        </Card.Title>
        <Card.Subtitle className="fw-normal">Actions</Card.Subtitle>

        {operator === buyer && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              onClick={() => {
                fundMinimumBalance(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Fund Minimum Balance
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              onClick={() => {
                console.log("___ Send 1st Escrow ___");

                firstEscrowAmount(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  escrowAmount1
                );
              }}
            >
              Send 1st Escrow
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              onClick={() => {
                console.log("___ Send 1st Escrow ___");

                secondEscrowAmount(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  escrowAmount2
                );
              }}
            >
              Send 2nd Escrow
            </Button>
            <Button
              variant="warning"
              size="sm"
              className="m-1"
              onClick={() => {
                console.log("(_)___(_)");

                signalArbitration(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Signal Arbitration
            </Button>
            <Button
              variant="warning"
              size="sm"
              className="m-1"
              onClick={() => {
                console.log("_)_(_");

                signalPullOut(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Signal Pull Out
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              onClick={() => {
                buyerWithdrawEscrow(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Buyer Withdraw Escrow
            </Button>
          </>
        )}

        {operator === seller && (
          <>
            <Button variant="secondary" size="sm" className="m-1">
              Withdraw Escrow
            </Button>
          </>
        )}

        {operator === creator && (
          <>
            <Button
              variant="danger"
              size="sm"
              className="m-1"
              onClick={() => {
                deleteApp(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Delete App
            </Button>
          </>
        )}

        {operator === arbiter && (
          <>
            <Button
              variant="info"
              size="sm"
              className="m-1"
              onClick={() => {
                console.log("___");

                sendHoldingsToBuyer(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  buyer
                );
              }}
            >
              Send Holdings to Buyer
            </Button>
            <Button
              variant="info"
              size="sm"
              className="m-1"
              onClick={() => {
                sendHoldingsToSeller(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  seller
                );
              }}
            >
              Send Holdings to Seller
            </Button>
          </>
        )}

        {operator === lender && (
          <>
            <Button
              variant="success"
              size="sm"
              disabled
              className="m-1"
              onClick={() => {
                console.log("___");
              }}
            >
              Signal Lender Approval
            </Button>
            <Button
              variant="success"
              size="sm"
              disabled
              className="m-1"
              onClick={() => {
                console.log("___");
              }}
            >
              Finance Purchase
            </Button>
            <Button
              variant="success"
              disabled
              size="sm"
              className="m-1"
              onClick={() => {
                console.log("___");
              }}
            >
              Change Down Payment
            </Button>
          </>
        )}

        {operator === jurisdiction && (
          <>
            <Button
              variant="light"
              disabled
              size="sm"
              className="m-1"
              onClick={() => {}}
            >
              Change Taxes
            </Button>
          </>
        )}

        {operator === jurisdiction && (
          <>
            <Button
              variant="light"
              disabled
              size="sm"
              className="m-1"
              onClick={() => {}}
            >
              Change Title Company Fee
            </Button>

            <Button
              variant="light"
              disabled
              size="sm"
              className="m-1"
              onClick={() => {}}
            >
              Change Outstanding Balance
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
