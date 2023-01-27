import algosdk, {
  AtomicTransactionComposer,
  ABIArgument,
  makeAssetTransferTxnWithSuggestedParamsFromObject,
} from "algosdk";
import { Algod } from "../../services/algod";
import { Buffer } from "buffer";

import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

import ABI from "../../contractExports/contracts/cashBuy/application.json";
import { signer as AlgoSigner } from "../helpers/signers/AlgoSigner";

export async function stablecoinClawback(
  sender: string,
  contractAddress: string, // contract address
  recv: string, // buyer or seller
  network: string,
  fungibleTokenId: number,
  fungibleTokenBalance: number
) {
  try {
    console.log("stablecoinClawback from contract", contractAddress);
    let atc = new AtomicTransactionComposer();
    let params = await Algod.getAlgod(network).getTransactionParams().do();
    params.flatFee = true;
    params.fee = 1000 * 2; // 1 fee for this txn and 1 for the optin from the contract into the ASA

    const txn = makeAssetTransferTxnWithSuggestedParamsFromObject({
      assetIndex: fungibleTokenId,
      from: sender,
      to: recv,
      suggestedParams: params,
      amount: fungibleTokenBalance,
      note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
      revocationTarget: contractAddress,
    });
    const tws = {
      txn: txn,
      signer: AlgoSigner,
    };
    atc.addTransaction(tws);

    const tx_id = await atc.submit(Algod.getAlgod(network));
    console.log("submit_response", tx_id);
    showSuccessToast("Sent ASA clawback request to network");
  } catch (e) {
    showErrorToast("Error occurred while clawing back ASA");
    console.error(e);
  }
}
