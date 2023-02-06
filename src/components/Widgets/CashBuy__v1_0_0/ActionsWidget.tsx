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
import { stablecoinClawback } from "../../../contractActions/CashBuy__v1_0_0/stablecoinClawback";

import { useNavigate } from "react-router-dom";

interface P {
  stablecoinIssuerClawbackAddress: string;
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
  inspectionPeriodStart: number;
  inspectionPeriodEnd: number;
  inspectionPeriodExtension: number;
  movingDate: number;
  closingDate: number;
  freeFundsDate: number;
  buyerPulloutFlag: number;
  buyerArbitrationFlag: number;
  sellerArbitrationFlag: number;
  showNoteModal: () => void;
}

export const ActionsWidget = (props: P) => {
  const {
    stablecoinIssuerClawbackAddress,
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
    inspectionPeriodStart,
    inspectionPeriodEnd,
    inspectionPeriodExtension,
    movingDate,
    closingDate,
    freeFundsDate,
    buyerPulloutFlag,
    buyerArbitrationFlag,
    sellerArbitrationFlag,
    showNoteModal,
  } = props;

  const settings = useAppSelector((state: RootState) => state.settings);
  const navigate = useNavigate();

  console.log("ACTIONS WIDGET TEST");
  console.log("balance", balance);
  console.log("freeFundsDate", freeFundsDate);
  console.log("now", now);
  console.log(
    "--__--",
    fungibleTokenBalance > 0 &&
      balance > 0 &&
      sellerArbitrationFlag > 0 &&
      buyerArbitrationFlag > 0
  );

  return (
    <Card border="light" className="text-center p-0 mb-4">
      <Card.Body className="">
        <Card.Title>Actions</Card.Title>
        {operator === buyer && <span>Buyer</span>}
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
                  // let byteCount = getValues("title").length + getValues("note").length;
                  let buyerByteCount = 1029
                  let sellerByteCount = 1030
                  let mbrForBuyerNotes = 2500 + 400 * buyerByteCount || -1; // for Buyer Notes
                  let mbrForSellerNotes = 2500 + 400 * sellerByteCount || -1; // for Seller Notes

                  let mbr = 200000 + mbrForBuyerNotes + mbrForSellerNotes

                  console.log('mbr', mbr)

                  fundMinimumBalance(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork,
                    mbr // 100,000 mAlgos for optin to ASA + 100,000 mAlgos for being able to issue calls from the contract
                  );
                }}>Fund Minimum Balance</Button> : <Button size="sm" className="m-1" disabled> Fund Minimum Balance{" "} </Button>
            }

            {
              /* prettier-ignore */
              buyerPulloutFlag < 1 && now <= inspectionPeriodEnd && fungibleTokenBalance >= 0 && fungibleTokenBalance < escrowAmount1 ?
              <Button variant="secondary" size="sm" className="m-1"
                onClick={() => {
                  firstEscrowAmount(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    fungibleTokenId,
                    settings.selectedAlgorandNetwork,
                    escrowAmount1
                  );
                }}>Send 1st Escrow</Button> : <Button size="sm" className="m-1" disabled>Send 1st Escrow</Button>
            }

            {
              /* prettier-ignore */
              fungibleTokenBalance >= 0 && inspectionPeriodEnd < now && now < closingDate && buyerArbitrationFlag <= 0 && sellerArbitrationFlag <= 0 &&
              buyerArbitrationFlag <= 0 && buyerPulloutFlag < 1 && escrowAmount1 <= fungibleTokenBalance && fungibleTokenBalance < escrowAmount1 + escrowAmount2  ?
              <Button variant="secondary" size="sm" className="m-1"
                onClick={() => {
                  secondEscrowAmount(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    fungibleTokenId,
                    settings.selectedAlgorandNetwork,
                    escrowAmount2
                  );
                }}>Send 2nd Escrow</Button> : <Button size="sm" className="m-1" disabled>Send 2nd Escrow</Button>
            }

            {
              /* prettier-ignore */
              (inspectionPeriodEnd <= now && now <= closingDate && buyerArbitrationFlag < 1 && buyerPulloutFlag < 1 && balance > 0 && fungibleTokenBalance > 0) ||
              (inspectionPeriodStart <= now && now <= closingDate && buyerArbitrationFlag < 1 && sellerArbitrationFlag === 1 && balance > 0 && fungibleTokenBalance > 0) ||
              (closingDate < now && now < freeFundsDate && sellerArbitrationFlag === 1 && buyerArbitrationFlag < 1) ||
              (buyerPulloutFlag === 1 && inspectionPeriodEnd <= now && now <= closingDate && buyerPulloutFlag < 1 && sellerArbitrationFlag === 1) ?
              <Button variant="warning" size="sm" className="m-1"
                onClick={() => {
                  buyerArbitration(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork
                  );
                }}>Buyer Arbitration</Button> : <Button size="sm" className="m-1" disabled>Buyer Arbitration</Button>
            }

            {
              /* prettier-ignore */
              now < inspectionPeriodEnd && buyerPulloutFlag < 1 && balance > 0 && fungibleTokenBalance > 0 ?
              <Button variant="warning" size="sm" className="m-1"
                onClick={() => {
                  buyerPullOut(
                    settings.selectedAlgorandAccount,
                    appId,
                    settings.selectedAlgorandNetwork
                  );
                }}>Buyer Pullout</Button> : <Button size="sm" className="m-1" disabled>Buyer Pullout</Button>
            }

            {
              /* prettier-ignore */
              (buyerPulloutFlag === 1 && closingDate < now && buyerArbitrationFlag < 1 && sellerArbitrationFlag < 1 && fungibleTokenBalance > 0)
              ||
              (buyerArbitrationFlag === 1 && freeFundsDate < now && sellerArbitrationFlag < 1 && fungibleTokenBalance > 0) ?
              <Button
                  variant="secondary"
                  size="sm"
                  className="m-1"
                  onClick={() => {
                    withdrawEscrow(
                      settings.selectedAlgorandAccount,
                      appId,
                      fungibleTokenId,
                      settings.selectedAlgorandNetwork
                    );
                  }}>Buyer Withdraw ASA</Button> : <Button size="sm" className="m-1" disabled>Buyer Withdraw ASA</Button>
            }
            {
              /* prettier-ignore */
              (buyerPulloutFlag === 1 && inspectionPeriodExtension < now && buyerArbitrationFlag < 1 && sellerArbitrationFlag < 1 && fungibleTokenBalance < 0 && balance > 0) ||
              (freeFundsDate < now && sellerArbitrationFlag < 1 && buyerArbitrationFlag === 1 && fungibleTokenBalance < 0 && balance > 0) ?
              <Button variant="secondary" size="sm" className="m-1"
                onClick={() => {
                  withdrawBalance(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork
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
                      settings.selectedAlgorandAccount,
                      contractAddress,
                      appId,
                      settings.selectedAlgorandNetwork,
                      fungibleTokenId,
                      200000 // 100,000 mAlgos for optin to ASA + 100,000 mAlgos for being able to issue calls from the contract
                    );
                  }}>Optin to ASA</Button> : <Button size="sm" className="m-1" disabled>Optin to ASA</Button>
            }

            {
              /* prettier-ignore */
              (now <= inspectionPeriodEnd && fungibleTokenBalance === 0) || 
              (inspectionPeriodExtension < now && buyerPulloutFlag === 1 && sellerArbitrationFlag < 1 && fungibleTokenBalance === 0) ||
              (freeFundsDate < now && sellerArbitrationFlag < 1 && buyerArbitrationFlag === 1 && fungibleTokenBalance === 0)
              ? 
              <Button variant="info" size="sm" className="m-1"
                onClick={() => {
                  optoutContractFromASA(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork,
                    fungibleTokenId
                  );
                }}>Buyer Optout from ASA</Button> : <Button size="sm" className="m-1" disabled>Buyer Optout from ASA </Button>
            }

            {
              /* prettier-ignore */
              (balance === 0 /* && freeFundsDate < now */) ?
              <Button variant="danger" size="sm" className="m-1"
                onClick={() => {
                  deleteApp(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork,
                  );
                }}>Buyer Delete App</Button> : <Button size="sm" className="m-1" disabled>Buyer Delete App</Button>
            }

            {
              // (true) ?
              // <Button variant="light" size="sm" className="m-1"
              //   onClick={() => {
              //     showNoteModal()
              //   }}>Buyer Note</Button> : <Button size="sm" className="m-1" disabled>Buyer Note</Button>
            }
          </>
        )}
        <br />
        <br />
        {operator === seller && <span>Seller</span>}
        <br />
        {operator === seller && (
          <>
            {
              /* prettier-ignore */
              (now < closingDate && sellerArbitrationFlag < 1 && balance > 0 && fungibleTokenBalance > 0 && buyerPulloutFlag < 1) ||
              (closingDate < now && now < freeFundsDate && buyerArbitrationFlag === 1 && sellerArbitrationFlag < 1 && buyerPulloutFlag < 1) ||
              (now < inspectionPeriodExtension && buyerPulloutFlag === 1 && sellerArbitrationFlag < 1 && balance > 0 && fungibleTokenBalance > 0)

              ?
              <Button variant="warning" size="sm" className="m-1"
                onClick={() => {
                  sellerArbitration(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork
                  );
                }}>Seller Arbitration</Button> : <Button size="sm" className="m-1" disabled>Seller Arbitration</Button>
            }
            {
              /* prettier-ignore */
              (closingDate < now && buyerPulloutFlag < 1 && buyerArbitrationFlag < 1 && sellerArbitrationFlag < 1 && fungibleTokenBalance > 0) ||
              (freeFundsDate < now && buyerArbitrationFlag < 1 && sellerArbitrationFlag === 1 && fungibleTokenBalance > 0)
              ?
              <Button
                variant="secondary"
                size="sm"
                className="m-1"
                onClick={() => {
                  withdrawEscrow(
                    settings.selectedAlgorandAccount,
                    appId,
                    fungibleTokenId,
                    settings.selectedAlgorandNetwork
                  );
                }}
              >
                Seller Withdraw ASA
              </Button> : <Button size="sm" className="m-1" disabled>Seller Withdraw ASA</Button>
            }
            {
              /* prettier-ignore */
              (closingDate < now && buyerPulloutFlag < 1 && buyerArbitrationFlag < 1 && fungibleTokenBalance < 0 && balance > 0) || 
              (freeFundsDate < now && buyerArbitrationFlag < 1 && sellerArbitrationFlag === 1 && balance > 0 && fungibleTokenBalance < 0)
              ?
              <Button
                variant="secondary"
                size="sm"
                className="m-1"
                onClick={() => {
                  withdrawBalance(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork
                  );
                }}>Seller Withdraw Balance</Button> : <Button size="sm" className="m-1" disabled>Seller Withdraw Balance</Button>
            }
            {
              /* prettier-ignore */
              (closingDate < now && buyerPulloutFlag < 1 && buyerArbitrationFlag < 1 && fungibleTokenBalance === 0) ||
              (freeFundsDate < now && buyerArbitrationFlag < 1 && sellerArbitrationFlag === 1 && fungibleTokenBalance === 0)
              ?
              <Button
                variant="info"
                size="sm"
                className="m-1"
                onClick={() => {
                  optoutContractFromASA(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork,
                    fungibleTokenId
                  );
                }}
              >
                Seller Optout from ASA
              </Button> : <Button size="sm" className="m-1" disabled>Seller Optout from ASA</Button>
            }

            {
              /* prettier-ignore */
              (balance === 0 /* && freeFundsDate < now */) ?
              <Button variant="danger" size="sm" className="m-1"
                onClick={() => {
                  deleteApp(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork
                  );

                  navigate("/dashboard/transactions")
                }}>Seller Delete App</Button> : <Button size="sm" className="m-1" disabled>Seller Delete App</Button>
            }
          </>
        )}
        <br />
        <br />
        {operator === stablecoinIssuerClawbackAddress && (
          <span>Stablecoin Issuer</span>
        )}
        <br />
        {operator === stablecoinIssuerClawbackAddress && (
          <>
            {
              /* prettier-ignore */
              (fungibleTokenBalance > 0 && balance > 0 && sellerArbitrationFlag > 0 && buyerArbitrationFlag > 0) ?
              <Button
                variant="secondary"
                size="sm"
                className="m-1"
                onClick={() => {
                  console.log('Clawback to Buyer')

                  stablecoinClawback(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    buyer,
                    settings.selectedAlgorandNetwork,
                    fungibleTokenId,
                    fungibleTokenBalance
                  );
                }}>Clawback to Buyer</Button> : <Button size="sm" className="m-1" disabled>Clawback to Buyer</Button>
            }

            {
              /* prettier-ignore */
              (fungibleTokenBalance > 0 && balance > 0 && sellerArbitrationFlag > 0 && buyerArbitrationFlag > 0) ?
              <Button
                variant="secondary"
                size="sm"
                className="m-1"
                onClick={() => {
                  console.log('Clawback to Seller')
                  stablecoinClawback(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    seller,
                    settings.selectedAlgorandNetwork,
                    fungibleTokenId,
                    fungibleTokenBalance
                  );
                }}>Clawback to Seller</Button> : <Button size="sm" className="m-1" disabled>Clawback to Seller</Button>
            }
          </>
        )}
        <br />
        <br />
        {true && <span>General</span>}
        <br />
        {true && (
          <>
            {
              /* prettier-ignore */
              (balance === 0 && freeFundsDate < now) ?
              <Button variant="danger" size="sm" className="m-1"
                onClick={() => {
                  deleteApp(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork
                  );

                  navigate("/dashboard/transactions")
                }}>Delete App</Button> : <Button size="sm" className="m-1" disabled>Delete App</Button>
            }

            {
              /* prettier-ignore */
              (fungibleTokenBalance === 0 && sellerArbitrationFlag > 0 && buyerArbitrationFlag > 0) ?
              <Button
                variant="info"
                size="sm"
                className="m-1"
                onClick={() => {
                  optoutContractFromASA(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork,
                    fungibleTokenId
                  );
                }}
              >
                Optout from ASA
              </Button> : <Button size="sm" className="m-1" disabled>Optout from ASA</Button>
            }

            {
              /* prettier-ignore */
              (balance > 0 && fungibleTokenBalance < 0 && sellerArbitrationFlag > 0 && buyerArbitrationFlag > 0) ?
              <Button
                variant="secondary"
                size="sm"
                className="m-1"
                onClick={() => {
                  withdrawBalance(
                    settings.selectedAlgorandAccount,
                    contractAddress,
                    appId,
                    settings.selectedAlgorandNetwork
                  );
                }}>Withdraw Balance</Button> : <Button size="sm" className="m-1" disabled>Withdraw Balance</Button>
            }
          </>
        )}
      </Card.Body>
    </Card>
  );
};
