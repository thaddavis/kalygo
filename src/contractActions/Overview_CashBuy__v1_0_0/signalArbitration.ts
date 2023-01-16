import algosdk from "algosdk";
import { Algod } from "../../services/algod";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { supportedContracts } from "../../data/supportedContracts";

export async function signalArbitration(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string
) {
  try {
    console.log("_-_ _-_");

    let params = await Algod.getAlgod(network).getTransactionParams().do();

    params.flatFee = true;
    params.fee = 1000;

    console.log("_-_ _-_");

    const noOpTxn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      appId,
      [new Uint8Array(Buffer.from("signal_arbitration"))],
      undefined,
      undefined,
      undefined,
      new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0))
    );

    console.log("_-_ _-_");

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
      ledger: network,
      tx: signedTxs[0].blob,
    });

    console.log("sentTx", sentTx);

    showSuccessToast("Request to signal arbitration sent to network");
  } catch (e) {
    showErrorToast("Error occurred when sending signal arbitration request");
    console.error(e);
  }
}
