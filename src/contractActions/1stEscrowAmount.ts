import algosdk from "algosdk";
import { Algod } from "../services/algod";

export async function firstEscrowAmount(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  escrowAmount: number
) {
  try {
    let params = await Algod.algodInstance().getTransactionParams().do();

    params.flatFee = true;
    params.fee = 1000;

    let sender = "RHKHUONCBB7JOIQ2RDCSV3NUX5JFKLLOG2RKN4LRIJ6DQMAIBTFLLO72DM";

    const payTxn = algosdk.makePaymentTxnWithSuggestedParams(
      sender,
      "YCVBXXTZUOBIN3REFOVFTM5LSABA4G32S3J7YBLXJVASE25OCUQCNUSBDE",
      escrowAmount,
      undefined,
      new Uint8Array(Buffer.from("1st Escrow Amount")),
      params
    );

    const noOpTxn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      388,
      [new Uint8Array(Buffer.from("fund_contract"))],
      undefined,
      undefined,
      undefined,
      new Uint8Array(Buffer.from("1st Escrow Amount"))
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

    // console.log("combinedBase64Txns", combinedBase64Txns);

    await (window as any).AlgoSigner.send({
      ledger: "localhost",
      tx: combinedBase64Txns,
    });
  } catch (e) {}
}
