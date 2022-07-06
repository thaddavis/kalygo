import algosdk from "algosdk";
import { Algod } from "../services/algod";

export async function buyerWithdrawEscrow(
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
      "QHGMAMCTEHZ2RQV2DRXSPAKIIT3REVK46CHNDJSW6WNXJLSJ7BB76NHDGY",
      params,
      388,
      [new Uint8Array(Buffer.from("seller_withdraw_funds"))],
      undefined,
      undefined,
      undefined,
      new Uint8Array(Buffer.from("Seller Withdraw Escrow"))
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
