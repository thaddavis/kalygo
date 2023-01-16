import React from "react";
import { Card, Button } from "react-bootstrap";

import { RootState } from "../../../store/store";
import { useAppSelector } from "../../../store/hooks";
import { optinContractToASA } from "../../../contractActions/CashBuy__v1_0_0/optinContractToASA";
import { firstEscrowAmount } from "../../../contractActions/CashBuy__v1_0_0/1stEscrowAmount";
import { secondEscrowAmount } from "../../../contractActions/CashBuy__v1_0_0/2ndEscrowAmount";
import { buyerPullOut } from "../../../contractActions/CashBuy__v1_0_0/buyerPullOut";
import { signalArbitration } from "../../../contractActions/CashBuy__v1_0_0/signalArbitration";
import { withdrawEscrow } from "../../../contractActions/CashBuy__v1_0_0/withdrawEscrow";
import { withdrawBalance } from "../../../contractActions/CashBuy__v1_0_0/withdrawBalance";
import { deleteApp } from "../../../contractActions/CashBuy__v1_0_0/deleteApp";
import { fundMinimumBalance } from "../../../contractActions/CashBuy__v1_0_0/fundMinimumBalance";
import { optoutContractFromASA } from "../../../contractActions/CashBuy__v1_0_0/optoutContractFromASA";

interface P {
  creator: string;
  buyer: string;
  seller: string;
  operator: string;
  contractAddress: string;
  appId: number;
  firstEscrowAmount: number;
  secondEscrowAmount: number;
  fungibleTokenId: number;
  fungibleTokenBalance: number;
  balance: number;
  now: number;
  inspectionPeriodEnd: number;
}

export const ActionsWidget = (props: P) => {
  const {
    creator,
    buyer,
    seller,
    operator,
    contractAddress,
    appId,
    firstEscrowAmount: escrowAmount1,
    secondEscrowAmount: escrowAmount2,
    fungibleTokenId,
    fungibleTokenBalance,
    balance,
    now,
    inspectionPeriodEnd,
  } = props;

  const settings = useAppSelector((state: RootState) => state.settings);

  console.log("fungibleTokenBalance ->", fungibleTokenBalance);

  return (
    <Card border="light" className="text-center p-0 mb-4">
      <Card.Body className="">
        <Card.Subtitle className="fw-normal pb-4">Role Actions</Card.Subtitle>
        <Card.Title>
          {operator === creator && (
            <>
              <span>Creator</span>
              <br />
            </>
          )}
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
          <br />
        </Card.Title>
        {operator === buyer && (
          <>
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="m-1"
              onClick={() => {}}
            >
              Add Note
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="m-1"
              onClick={() => {}}
            >
              Send Custom Escrow Token Amount
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={balance >= 200000 ? true : false}
              onClick={() => {
                fundMinimumBalance(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  200000 // 100,000 mAlgos for optin to ASA + 100,000 mAlgos for being able to issue calls from the contract
                );
              }}
            >
              Fund Minimum Balance
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={fungibleTokenBalance >= escrowAmount1}
              onClick={() => {
                firstEscrowAmount(
                  settings.selectedAccount,
                  contractAddress,
                  fungibleTokenId,
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
              disabled={fungibleTokenBalance >= escrowAmount1 + escrowAmount2}
              onClick={() => {
                secondEscrowAmount(
                  settings.selectedAccount,
                  contractAddress,
                  fungibleTokenId,
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
              disabled
              onClick={() => {
                signalArbitration(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Buyer Arbitration
            </Button>
            <Button
              variant="warning"
              size="sm"
              className="m-1"
              disabled={
                !!now && !!inspectionPeriodEnd && now > inspectionPeriodEnd
              }
              onClick={() => {
                buyerPullOut(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Buyer Pullout
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={fungibleTokenBalance > 0 ? false : true}
              onClick={() => {
                withdrawEscrow(
                  settings.selectedAccount,
                  appId,
                  fungibleTokenId,
                  settings.selectedNetwork
                );
              }}
            >
              Buyer Withdraw ASA
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="m-1"
              disabled={balance > 0 ? false : true}
              onClick={() => {
                withdrawBalance(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork
                );
              }}
            >
              Buyer Withdraw Balance
            </Button>
          </>
        )}
        {operator === seller && (
          <>
            <Button variant="secondary" size="sm" className="m-1">
              Seller Withdraw ASA
            </Button>
          </>
        )}
        {operator === creator && (
          <>
            <Button
              variant="success"
              size="sm"
              className="m-1"
              disabled={fungibleTokenBalance >= 0}
              onClick={() => {
                optinContractToASA(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  fungibleTokenId,
                  200000 // 100,000 mAlgos for optin to ASA + 100,000 mAlgos for being able to issue calls from the contract
                );
              }}
            >
              Optin to ASA
            </Button>
            <Button
              variant="info"
              size="sm"
              className="m-1"
              disabled={fungibleTokenBalance === -1}
              onClick={() => {
                optoutContractFromASA(
                  settings.selectedAccount,
                  contractAddress,
                  appId,
                  settings.selectedNetwork,
                  fungibleTokenId
                );
              }}
            >
              Optout from ASA
            </Button>
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
        {/* {operator === arbiter && (
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
        )} */}
      </Card.Body>
    </Card>
  );
};
