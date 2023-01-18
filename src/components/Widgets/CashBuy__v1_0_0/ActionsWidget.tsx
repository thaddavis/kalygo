import React from "react";
import { Card, Button } from "react-bootstrap";

import { RootState } from "../../../store/store";
import { useAppSelector } from "../../../store/hooks";
import { optinContractToASA } from "../../../contractActions/CashBuy__v1_0_0/optinContractToASA";
import { firstEscrowAmount } from "../../../contractActions/CashBuy__v1_0_0/1stEscrowAmount";
import { secondEscrowAmount } from "../../../contractActions/CashBuy__v1_0_0/2ndEscrowAmount";
import { buyerPullOut } from "../../../contractActions/CashBuy__v1_0_0/buyerPullOut";
import { buyerArbitration } from "../../../contractActions/CashBuy__v1_0_0/buyerArbitration";
import { sellerArbitration } from "../../../contractActions/CashBuy__v1_0_0/sellerArbitration";
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
  inspectionPeriodExtension: number;
  movingDate: number;
  closingDate: number;
  freeFundsDate: number;
  buyerPulloutFlag: number;
  buyerArbitrationFlag: number;
  sellerArbitrationFlag: number;
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
    inspectionPeriodExtension,
    movingDate,
    closingDate,
    freeFundsDate,
    buyerPulloutFlag,
    buyerArbitrationFlag,
    sellerArbitrationFlag,
  } = props;

  const settings = useAppSelector((state: RootState) => state.settings);

  console.log("sellerArbitrationFlag ->", sellerArbitrationFlag);

  return (
    <Card border="light" className="text-center p-0 mb-4">
      <Card.Body className="">
        <Card.Title>Actions</Card.Title>
        {operator === creator && <span>Buyer</span>}
        <br />
        {operator === buyer && (
          <>
            {
              /* prettier-ignore */
              balance === 0 && now < inspectionPeriodEnd ? 
              <Button
                variant="secondary"
                size="sm"
                className="m-1"
                onClick={() => {
                  fundMinimumBalance(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork,
                    200000 // 100,000 mAlgos for optin to ASA + 100,000 mAlgos for being able to issue calls from the contract
                  );
                }}>Fund Minimum Balance</Button> : <Button size="sm" className="m-1" disabled> Fund Minimum Balance{" "} </Button>
            }

            {
              /* prettier-ignore */
              buyerPulloutFlag < 1 && now <= inspectionPeriodEnd && fungibleTokenBalance >= 0 && fungibleTokenBalance < escrowAmount1 ?
              <Button variant="secondary" size="sm" className="m-1"
                onClick={() => {
                  firstEscrowAmount(
                    settings.selectedAccount,
                    contractAddress,
                    fungibleTokenId,
                    settings.selectedNetwork,
                    escrowAmount1
                  );
                }}>Send 1st Escrow</Button> : <Button size="sm" className="m-1" disabled>Send 1st Escrow</Button>
            }

            {
              /* prettier-ignore */
              fungibleTokenBalance >= 0 && inspectionPeriodEnd < now && now < closingDate &&
              buyerPulloutFlag < 1 && escrowAmount1 <= fungibleTokenBalance && fungibleTokenBalance < escrowAmount1 + escrowAmount2  ?
              <Button variant="secondary" size="sm" className="m-1"
                onClick={() => {
                  secondEscrowAmount(
                    settings.selectedAccount,
                    contractAddress,
                    fungibleTokenId,
                    settings.selectedNetwork,
                    escrowAmount2
                  );
                }}>Send 2nd Escrow</Button> : <Button size="sm" className="m-1" disabled>Send 2nd Escrow</Button>
            }

            {
              /* prettier-ignore */
              (now <= closingDate && buyerArbitrationFlag < 1)  ||
              (closingDate < now && now < freeFundsDate && sellerArbitrationFlag === 1 && buyerArbitrationFlag < 1)?
              <Button variant="warning" size="sm" className="m-1"
                onClick={() => {
                  buyerArbitration(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork
                  );
                }}>Buyer Arbitration</Button> : <Button size="sm" className="m-1" disabled>Buyer Arbitration</Button>
            }

            {
              /* prettier-ignore */
              now < inspectionPeriodEnd && buyerPulloutFlag < 1 ?
              <Button variant="warning" size="sm" className="m-1"
                onClick={() => {
                  buyerPullOut(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork
                  );
                }}>Buyer Pullout</Button> : <Button size="sm" className="m-1" disabled>Buyer Pullout</Button>
            }

            {
              /* prettier-ignore */
              (buyerPulloutFlag === 1 && inspectionPeriodExtension < now && buyerArbitrationFlag < 1 && sellerArbitrationFlag < 1) 
              ||
              (buyerArbitrationFlag === 1 && freeFundsDate < now && sellerArbitrationFlag < 1 && fungibleTokenBalance > 0) ?
              <Button
                  variant="secondary"
                  size="sm"
                  className="m-1"
                  onClick={() => {
                    withdrawEscrow(
                      settings.selectedAccount,
                      appId,
                      fungibleTokenId,
                      settings.selectedNetwork
                    );
                  }}>Buyer Withdraw ASA</Button> : <Button size="sm" className="m-1" disabled>Buyer Withdraw ASA</Button>
            }
            {
              /* prettier-ignore */
              (buyerPulloutFlag === 1 && inspectionPeriodExtension < now && buyerArbitrationFlag < 1 && sellerArbitrationFlag < 1 && fungibleTokenBalance < 0 && balance > 0) ||
              (inspectionPeriodExtension < now && buyerPulloutFlag === 1 && sellerArbitrationFlag < 1 && fungibleTokenBalance >= 0) ||
              (freeFundsDate < now && sellerArbitrationFlag < 1 && buyerArbitrationFlag === 1 && fungibleTokenBalance < 0 && balance > 0) ?
              <Button variant="secondary" size="sm" className="m-1"
                onClick={() => {
                  withdrawBalance(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork
                  );
                }}>Buyer Withdraw Balance</Button> : <Button size="sm" className="m-1" disabled>Buyer Withdraw Balance</Button>
            }
            {
              /* prettier-ignore */
              (now <= inspectionPeriodEnd && fungibleTokenBalance < 0 && balance >= 200000 && buyerPulloutFlag < 1 && sellerArbitrationFlag < 1 && sellerArbitrationFlag < 1)
              // TODO Arbitration flag scenarios
              ? 
                <Button variant="success" size="sm" className="m-1"
                  onClick={() => {
                    optinContractToASA(
                      settings.selectedAccount,
                      contractAddress,
                      appId,
                      settings.selectedNetwork,
                      fungibleTokenId,
                      200000 // 100,000 mAlgos for optin to ASA + 100,000 mAlgos for being able to issue calls from the contract
                    );
                  }}>Optin to ASA</Button> : <Button size="sm" className="m-1" disabled>Optin to ASA</Button>
            }

            {
              /* prettier-ignore */
              (now <= inspectionPeriodEnd && fungibleTokenBalance === 0) || 
              (inspectionPeriodExtension < now && buyerPulloutFlag === 1 && sellerArbitrationFlag < 1 && fungibleTokenBalance >= 0) ||
              (freeFundsDate < now && sellerArbitrationFlag < 1 && buyerArbitrationFlag === 1 && fungibleTokenBalance === 0)
              ? 
              <Button variant="info" size="sm" className="m-1"
                onClick={() => {
                  optoutContractFromASA(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork,
                    fungibleTokenId
                  );
                }}>Buyer Optout from ASA</Button> : <Button size="sm" className="m-1" disabled>Buyer Optout from ASA </Button>
            }

            {
              /* prettier-ignore */
              (balance === 0) ?
              <Button variant="danger" size="sm" className="m-1"
                onClick={() => {
                  deleteApp(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork
                  );
                }}>Buyer Delete App</Button> : <Button size="sm" className="m-1" disabled>Buyer Delete App</Button>
            }
          </>
        )}
        <br />
        <br />
        {operator === buyer && <span>Seller</span>}
        <br />
        {operator === seller && (
          <>
            {
              /* prettier-ignore */
              (now < closingDate && sellerArbitrationFlag < 1) ||
              (closingDate < now && now < freeFundsDate && buyerArbitrationFlag === 1 && sellerArbitrationFlag < 1)
              ?
              <Button variant="warning" size="sm" className="m-1"
                onClick={() => {
                  sellerArbitration(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork
                  );
                }}>Seller Arbitration</Button> : <Button size="sm" className="m-1" disabled>Seller Arbitration</Button>
            }
            {
              /* prettier-ignore */
              (freeFundsDate < now && buyerPulloutFlag < 1 && buyerArbitrationFlag < 1 && fungibleTokenBalance > 0) ?
              <Button
                variant="secondary"
                size="sm"
                className="m-1"
                onClick={() => {
                  withdrawEscrow(
                    settings.selectedAccount,
                    appId,
                    fungibleTokenId,
                    settings.selectedNetwork
                  );
                }}
              >
                Seller Withdraw ASA
              </Button> : <Button size="sm" className="m-1" disabled>Seller Withdraw ASA</Button>
            }
            {
              /* prettier-ignore */
              (closingDate < now && buyerPulloutFlag < 1 && buyerArbitrationFlag < 1 && fungibleTokenBalance < 0 && balance > 0) ?
              <Button
                variant="secondary"
                size="sm"
                className="m-1"
                onClick={() => {
                  withdrawBalance(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork
                  );
                }}>Seller Withdraw Balance</Button> : <Button size="sm" className="m-1" disabled>Seller Withdraw Balance</Button>
            }
            {
              /* prettier-ignore */
              (closingDate < now && buyerPulloutFlag < 1 && buyerArbitrationFlag < 1 && fungibleTokenBalance === 0) ?
              <Button
                variant="info"
                size="sm"
                className="m-1"
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
                Seller Optout from ASA
              </Button> : <Button size="sm" className="m-1" disabled>Seller Optout from ASA</Button>
            }

            {
              /* prettier-ignore */
              (balance === 0) ?
              <Button variant="danger" size="sm" className="m-1"
                onClick={() => {
                  deleteApp(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork
                  );
                }}>Seller Delete App</Button> : <Button size="sm" className="m-1" disabled>Seller Delete App</Button>
            }
          </>
        )}
        <br />
        <br />
        {operator === creator && <span>General</span>}
        <br />
        {operator === creator && (
          <>
            {
              /* prettier-ignore */
              (balance === 0 && freeFundsDate < now) ?
              <Button variant="danger" size="sm" className="m-1"
                onClick={() => {
                  deleteApp(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork
                  );
                }}>Delete App</Button> : <Button size="sm" className="m-1" disabled>Delete App</Button>
            }

            {
              /* prettier-ignore */
              (freeFundsDate < now && fungibleTokenBalance === 0) ?
              <Button
                variant="info"
                size="sm"
                className="m-1"
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
              </Button> : <Button size="sm" className="m-1" disabled>Optout from ASA</Button>
            }

            {
              /* prettier-ignore */
              (freeFundsDate < now && fungibleTokenBalance < 0 && balance > 0) ?
              <Button
                variant="secondary"
                size="sm"
                className="m-1"
                disabled={
                  now <= closingDate ||
                  (closingDate < now && fungibleTokenBalance >= 0) ||
                  (closingDate < now && balance === 0) ||
                  buyerPulloutFlag === 1
                }
                onClick={() => {
                  withdrawBalance(
                    settings.selectedAccount,
                    contractAddress,
                    appId,
                    settings.selectedNetwork
                  );
                }}>Withdraw Balance</Button> : <Button size="sm" className="m-1" disabled>Withdraw Balance</Button>
            }
          </>
        )}
      </Card.Body>
    </Card>
  );
};
