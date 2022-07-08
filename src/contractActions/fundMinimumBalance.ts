import { Algod } from "../services/algod";
import algosdk from "algosdk";
import { Buffer } from "buffer";
import { showSuccessToast } from "../utility/successToast";
import { showErrorToast } from "../utility/errorToast";

export async function fundMinimumBalance(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string
) {
  try {
    console.log("fundInitialAmount", {
      sender,
      contractAddress,
      appId,
      network,
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
      100000, // minimum amount
      undefined,
      new Uint8Array(Buffer.from("Fund Contract Collateral")),
      params
    );

    console.log("!", payTxn);

    const noOpTxn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      appId,
      [new Uint8Array(Buffer.from("fund_minimum_balance"))],
      undefined,
      undefined,
      undefined,
      new Uint8Array(Buffer.from("Fund Contract Collateral"))
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

    console.log("!", combinedBase64Txns);

    const sentTxn = await (window as any).AlgoSigner.send({
      ledger: network,
      tx: combinedBase64Txns,
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
