import { Algod } from "../../services/algod";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { supportedContracts } from "../../data/supportedContracts";
import { Buffer } from "buffer";
import algosdk, { AtomicTransactionComposer, Transaction } from "algosdk";
import { signer as AlgoSigner } from "../helpers/signers/AlgoSigner";

export async function fundMinimumBalance(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  amount: number
) {
  try {
    console.log("fundMinimumBalance", {
      sender,
      contractAddress,
      appId,
      network,
      amount,
    });
    let sp = await Algod.getAlgod(network).getTransactionParams().do();
    // Create a transaction
    const ptxn = new Transaction({
      from: sender,
      to: contractAddress,
      amount: amount,
      note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
      ...sp,
    });
    const tws = {
      txn: ptxn,
      signer: AlgoSigner,
    };
    let atc = new AtomicTransactionComposer();
    atc.addTransaction(tws);
    const tx_id = await atc.submit(Algod.getAlgod(network));
    console.log("submit_response", tx_id);
    showSuccessToast(
      "Request to fund minimum contract balance sent to network"
    );
  } catch (e) {
    showErrorToast(
      "Error occurred when sending fund minimum contract balance request"
    );
    console.error(e);
  }
}
