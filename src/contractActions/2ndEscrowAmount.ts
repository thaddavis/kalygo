import algosdk from "algosdk";
import { Algod } from "../services/algod";
import { Buffer } from "buffer";

export async function secondEscrowAmount(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  escrowAmount: number
) {
  try {
    console.log("!!!");

    let params = await Algod.getAlgod(network).getTransactionParams().do();

    params.flatFee = true;
    params.fee = 1000;

    console.log("!!!");

    const payTxn = algosdk.makePaymentTxnWithSuggestedParams(
      sender,
      contractAddress,
      escrowAmount,
      undefined,
      new Uint8Array(Buffer.from("2nd Escrow Amount")),
      params
    );

    console.log("!!!");

    const noOpTxn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      appId,
      [new Uint8Array(Buffer.from("fund_contract"))],
      undefined,
      undefined,
      undefined,
      new Uint8Array(Buffer.from("2nd Escrow Amount"))
    );

    let txns = [payTxn, noOpTxn];

    algosdk.assignGroupID(txns);

    let binaryTxs = [payTxn.toByte(), noOpTxn.toByte()];
    let base64Txs = binaryTxs.map((binary) =>
      (window as any).AlgoSigner.encoding.msgpackToBase64(binary)
    );

    let signedTxs = await (window as any).AlgoSigner.signTxn([
      {
        txn: base64Txs[0],
      },
      {
        txn: base64Txs[1],
      },
    ]);

    let signedTx1Binary = (window as any).AlgoSigner.encoding.base64ToMsgpack(
      signedTxs[0].blob
    );
    let signedTx2Binary = (window as any).AlgoSigner.encoding.base64ToMsgpack(
      signedTxs[1].blob
    );

    let combinedBinaryTxns = new Uint8Array(
      signedTx1Binary.byteLength + signedTx2Binary.byteLength
    );
    combinedBinaryTxns.set(signedTx1Binary, 0);
    combinedBinaryTxns.set(signedTx2Binary, signedTx1Binary.byteLength);

    let combinedBase64Txns = (
      window as any
    ).AlgoSigner.encoding.msgpackToBase64(combinedBinaryTxns);

    console.log("combinedBase64Txns", combinedBase64Txns);

    let sentTxn = await (window as any).AlgoSigner.send({
      ledger: network,
      tx: combinedBase64Txns,
    });

    console.log("sentTxn", sentTxn);
  } catch (e) {}
}
