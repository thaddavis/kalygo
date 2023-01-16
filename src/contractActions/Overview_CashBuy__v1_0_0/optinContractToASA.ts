import algosdk from "algosdk";
import { Algod } from "../../services/algod";
import { Buffer } from "buffer";

import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

export async function optinContractToASA(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  fungibleTokenId: number,
  optinAmount: number = 200000
) {
  try {
    console.log("!!!");

    let params = await Algod.getAlgod(network).getTransactionParams().do();

    params.flatFee = true;
    params.fee = 1000 * 2; // 1 fee for the

    // const payTxn = algosdk.makePaymentTxnWithSuggestedParams(
    //   sender,
    //   contractAddress,
    //   optinAmount,
    //   undefined,
    //   new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
    //   params
    // );

    const noOpTxn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      appId,
      [new Uint8Array(Buffer.from("optin_contract"))],
      undefined,
      undefined,
      [fungibleTokenId],
      new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0))
    );

    let binaryTxs = [noOpTxn.toByte()];
    let base64Txs = binaryTxs.map((binary) =>
      (window as any).AlgoSigner.encoding.msgpackToBase64(binary)
    );

    let signedTxs = await (window as any).AlgoSigner.signTxn([
      {
        txn: base64Txs[0],
      },
    ]);

    let sentTxn = await (window as any).AlgoSigner.send({
      ledger: network,
      tx: signedTxs[0].blob,
    });

    console.log("sentTxn", sentTxn);

    showSuccessToast("Sent ASA optin request to network");
  } catch (e) {
    showErrorToast("Error occurred when opting contract into ASA");
    console.error(e);
  }
}
