import algosdk, {
  AtomicTransactionComposer,
  makeApplicationDeleteTxnFromObject,
  ABIArgument,
} from "algosdk";
import { Algod } from "../../services/algod";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { signer as AlgoSigner } from "../helpers/signers/AlgoSigner";
import ABI from "../../contractExports/contracts/cashBuy/application.json";
import { supportedContracts } from "../../data/supportedContracts";

export async function deleteApp(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string
) {
  try {
    console.log("deleteApp");

    const contract = new algosdk.ABIContract(ABI.contract);
    let atc = new AtomicTransactionComposer();
    let params = await Algod.getAlgod(network).getTransactionParams().do();
    params.flatFee = true;
    params.fee = 1000;

    // Create a transaction
    const txn = makeApplicationDeleteTxnFromObject({
      appIndex: appId,
      from: sender,
      suggestedParams: params,
      note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
    });
    const tws = {
      txn: txn,
      signer: AlgoSigner,
    };

    atc.addTransaction(tws);

    // atc.addMethodCall({
    //   appID: appId,
    //   method: contract.getMethodByName("buyer_set_pullout"),
    //   methodArgs: [] as ABIArgument[],
    //   sender: sender,
    //   suggestedParams: params,
    //   note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
    //   signer: AlgoSigner,
    // });

    const tx_id = await atc.submit(Algod.getAlgod(network));
    console.log("submit_response", tx_id);

    // let params = await Algod.getAlgod(network).getTransactionParams().do();
    // params.flatFee = true;
    // params.fee = 1000;

    // const deleteAppTxn = algosdk.makeApplicationDeleteTxn(
    //   sender,
    //   params,
    //   appId,
    //   [],
    //   undefined,
    //   undefined,
    //   undefined,
    //   new Uint8Array(Buffer.from("Delete App"))
    // );

    // let binaryTx = deleteAppTxn.toByte();
    // let base64Tx = (window as any).AlgoSigner.encoding.msgpackToBase64(
    //   binaryTx
    // );

    // let signedTxs = await (window as any).AlgoSigner.signTxn([
    //   {
    //     txn: base64Tx,
    //   },
    // ]);

    // let sentTxn = await (window as any).AlgoSigner.send({
    //   ledger: network,
    //   tx: signedTxs[0].blob,
    // });

    // console.log("sentTxn", sentTxn);

    showSuccessToast("Request to delete smart contract sent to network");
  } catch (e) {
    showErrorToast("Error occurred when sending delete contract request");
    console.error(e);
  }
}
