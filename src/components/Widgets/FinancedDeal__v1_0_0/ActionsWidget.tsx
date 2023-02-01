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
} from "../../Charts";

import Profile1 from "../../assets/img/team/profile-picture-1.jpg";
import ProfileCover from "../../assets/img/profile-cover.jpg";

import teamMembers from "../../../data/teamMembers";
import { RootState } from "../../../store/store";
import { useAppSelector } from "../../../store/hooks";
import { fundMinimumBalance } from "../../../contractActions/FinancedDeal__v1_0_0/fundMinimumBalance";
import { firstEscrowAmount } from "../../../contractActions/FinancedDeal__v1_0_0/1stEscrowAmount";
import { secondEscrowAmount } from "../../../contractActions/FinancedDeal__v1_0_0/2ndEscrowAmount";
import { signalPullOut } from "../../../contractActions/FinancedDeal__v1_0_0/signalPullOut";
import { signalArbitration } from "../../../contractActions/FinancedDeal__v1_0_0/signalArbitration";
import { buyerWithdrawEscrow } from "../../../contractActions/FinancedDeal__v1_0_0/buyerWithdrawEscrow";
import { deleteApp } from "../../../contractActions/FinancedDeal__v1_0_0/deleteApp";
import { sendHoldingsToBuyer } from "../../../contractActions/FinancedDeal__v1_0_0/sendHoldingsToBuyer";
import { sendHoldingsToSeller } from "../../../contractActions/FinancedDeal__v1_0_0/sendHoldingsToSeller";

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
                  settings.selectedAlgorandAccount,
                  contractAddress,
                  appId,
                  settings.selectedAlgorandNetwork
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
                  settings.selectedAlgorandAccount,
                  contractAddress,
                  appId,
                  settings.selectedAlgorandNetwork,
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
                  settings.selectedAlgorandAccount,
                  contractAddress,
                  appId,
                  settings.selectedAlgorandNetwork,
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
                  settings.selectedAlgorandAccount,
                  contractAddress,
                  appId,
                  settings.selectedAlgorandNetwork
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
                  settings.selectedAlgorandAccount,
                  contractAddress,
                  appId,
                  settings.selectedAlgorandNetwork
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
                  settings.selectedAlgorandAccount,
                  contractAddress,
                  appId,
                  settings.selectedAlgorandNetwork
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
                  settings.selectedAlgorandAccount,
                  contractAddress,
                  appId,
                  settings.selectedAlgorandNetwork
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
                  settings.selectedAlgorandAccount,
                  contractAddress,
                  appId,
                  settings.selectedAlgorandNetwork,
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
                  settings.selectedAlgorandAccount,
                  contractAddress,
                  appId,
                  settings.selectedAlgorandNetwork,
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
