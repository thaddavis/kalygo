import algosdk from "algosdk";
import { Algod } from "../../services/algod";
import { Buffer } from "buffer";

import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

export async function secondEscrowAmount(
  sender: string,
  contractAddress: string,
  fungibleTokenId: number,
  network: string,
  escrow2Amount: number
) {
  try {
    console.log("!!!");

    let params = await Algod.getAlgod(network).getTransactionParams().do();

    console.log(params);

    params.flatFee = true;
    params.fee = 1000;

    console.log("___ ___ ___", algosdk);

    const payTxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      sender,
      contractAddress,
      undefined,
      undefined,
      escrow2Amount,
      new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
      fungibleTokenId,
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

    showSuccessToast("Sent 2nd escrow token payment request to network");
  } catch (e) {
    showErrorToast("Error occurred when sending 2nd escrow token payment");
    console.error(e);
  }
}
