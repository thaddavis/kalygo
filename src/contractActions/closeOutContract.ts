import algosdk from "algosdk";
import { Algod } from "../services/algod";
import { Buffer } from "buffer";

export async function closeOutContract(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string
) {
  try {
    let params = await Algod.getAlgod(network).getTransactionParams().do();

    params.flatFee = true;
    params.fee = 1000;

    const closeOutTxn = algosdk.makePaymentTxnWithSuggestedParams(
      sender,
      contractAddress,
      0, // minimum amount
      undefined,
      new Uint8Array(Buffer.from("Close Out Remaining Balance")),
      params
    );

    // const closeOutTxn = algosdk.makeApplicationCloseOutTxn(
    //   sender,
    //   params,
    //   appId,
    //   [],
    //   undefined,
    //   undefined,
    //   undefined,
    //   new Uint8Array(Buffer.from("Close Out Contract Balance"))
    // );

    // const noOpTxn = algosdk.makeApplicationDeleteTxn(
    //   sender,
    //   params,
    //   appId,
    //   [],
    //   undefined,
    //   undefined,
    //   undefined,
    //   new Uint8Array(Buffer.from("Delete App"))
    // );

    let binaryTx = closeOutTxn.toByte();
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
  } catch (e) {
    console.error(e);
  }
}
