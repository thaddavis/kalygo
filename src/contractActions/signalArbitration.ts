import algosdk from "algosdk";
import { Algod } from "../services/algod";

export async function signalArbitration(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string
) {
  try {
    let params = await Algod.getAlgod().getTransactionParams().do();

    params.flatFee = true;
    params.fee = 1000;

    const noOpTxn = algosdk.makeApplicationNoOpTxn(
      "RHKHUONCBB7JOIQ2RDCSV3NUX5JFKLLOG2RKN4LRIJ6DQMAIBTFLLO72DM",
      params,
      388,
      [new Uint8Array(Buffer.from("signal_arbitration"))],
      undefined,
      undefined,
      undefined,
      new Uint8Array(Buffer.from("Signal Arbitration"))
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

    let sentTx = await (window as any).AlgoSigner.send({
      ledger: "localhost",
      tx: signedTxs[0].blob,
    });

    console.log("sentTx", sentTx);
  } catch (e) {}
}
