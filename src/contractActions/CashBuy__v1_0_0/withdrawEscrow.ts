import algosdk, { AtomicTransactionComposer, ABIArgument } from "algosdk";
import { Algod } from "../../services/algod";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { supportedContracts } from "../../data/supportedContracts";

import ABI from "../../contractExports/contracts/cashBuy/application.json";
import { signer as AlgoSigner } from "../helpers/signers/AlgoSigner";

export async function withdrawEscrow(
  sender: string,
  appId: number,
  fungibleTokenId: number,
  network: string
) {
  try {
    console.log("withdrawEscrow");
    const contract = new algosdk.ABIContract(ABI.contract);
    let atc = new AtomicTransactionComposer();
    let params = await Algod.getAlgod(network).getTransactionParams().do();
    params.flatFee = true;
    params.fee = 1000 * 2; // 1 fee for this txn and 1 for the having contract send ASA to sender
    atc.addMethodCall({
      appID: appId,
      method: contract.getMethodByName("withdraw_escrow_balance"),
      methodArgs: [] as ABIArgument[],
      sender: sender,
      suggestedParams: params,
      note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
      signer: AlgoSigner,
      appForeignAssets: [fungibleTokenId],
    });
    const tx_id = await atc.submit(Algod.getAlgod(network));
    console.log("submit_response", tx_id);

    showSuccessToast("Withdraw escrow tokens request sent to network");
  } catch (e) {
    showErrorToast(
      "Error occurred when sending withdraw escrow tokens request"
    );
    console.error(e);
  }
}
