import algosdk from "algosdk";
import { Algod } from "../../services/algod";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";

export async function buyerWithdrawEscrow(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string
) {
  try {
    let params = await Algod.getAlgod(network).getTransactionParams().do();

    params.flatFee = true;
    params.fee = 1000;

    const noOpTxn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      appId,
      [new Uint8Array(Buffer.from("buyer_withdraw_funds"))],
      undefined,
      undefined,
      undefined,
      new Uint8Array(Buffer.from("Buyer Withdraw Escrow"))
    );

    let binaryTx = noOpTxn.toByte();
    let base64Tx = (window as any).AlgoSigner.encoding.msgpackToBase64(
      binaryTx
    );

    let signedTxs = await (window as any).AlgoSigner.signTxn([
      {
        txn: base64Tx,
      },
    ]);

    let sentTxn = await (window as any).AlgoSigner.send({
      ledger: network,
      tx: signedTxs[0].blob,
    });

    console.log("sentTxn", sentTxn);
    showSuccessToast("Withdraw escrow request sent to network");
  } catch (e) {
    showErrorToast("Error occurred when sending withdraw escrow request");
    console.error(e);
  }
}
