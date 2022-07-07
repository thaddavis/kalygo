import algosdk from "algosdk";
import { Algod } from "../services/algod";
import { Buffer } from "buffer";

export async function sendHoldingsToSeller(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  to: string
) {
  try {
    let params = await Algod.getAlgod(network).getTransactionParams().do();

    params.flatFee = true;
    params.fee = 1000;

    const noOpTxn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      appId,
      [
        new Uint8Array(Buffer.from("arbiter_withdraw_funds")),
        new Uint8Array(algosdk.decodeAddress(to).publicKey),
      ],
      [to],
      undefined,
      undefined,
      new Uint8Array(Buffer.from("Arbiter Sends Escrow To Seller"))
    );

    let binaryTx = noOpTxn.toByte();
    let base64Tx = (window as any).AlgoSigner.encoding.msgpackToBase64(
      binaryTx
    );

    console.log("address encoded", algosdk.decodeAddress(to));
    console.log(base64Tx);

    let signedTxs = await (window as any).AlgoSigner.signTxn([
      {
        txn: base64Tx,
      },
    ]);

    let sentTx = await (window as any).AlgoSigner.send({
      ledger: network,
      tx: signedTxs[0].blob,
    });

    console.log("sentTx", sentTx);
  } catch (e) {
    console.error(e);
  }
}
