import { Algod } from "../../services/algod";
import algosdk from "algosdk";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { supportedContracts } from "../../data/supportedContracts";

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

    console.log("!!!@#!!!");

    let params = await Algod.getAlgod(network).getTransactionParams().do();

    console.log(params);

    params.flatFee = true;
    params.fee = 1000;

    console.log("___ ___ ___", algosdk);

    const payTxn = algosdk.makePaymentTxnWithSuggestedParams(
      sender,
      contractAddress,
      amount, // minimum amount
      undefined,
      new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
      params
    );

    console.log("!", payTxn);

    let binaryTxs = [payTxn.toByte()];
    let base64Txs = binaryTxs.map((binary) =>
      (window as any).AlgoSigner.encoding.msgpackToBase64(binary)
    );

    let signedTxs = await (window as any).AlgoSigner.signTxn([
      {
        txn: base64Txs[0],
      },
    ]);

    const sentTxn = await (window as any).AlgoSigner.send({
      ledger: network,
      tx: signedTxs[0].blob,
    });

    console.log("---> sentTxn <---", sentTxn);

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
