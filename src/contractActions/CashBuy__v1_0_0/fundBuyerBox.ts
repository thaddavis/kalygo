import { Algod } from "../../services/algod";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { supportedContracts } from "../../data/supportedContracts";
import { Buffer } from "buffer";
import algosdk, {
  AtomicTransactionComposer,
  Transaction,
  ABIArgument,
} from "algosdk";
import { signer as AlgoSigner } from "../helpers/signers/AlgoSigner";
import ABI from "../../contractExports/contracts/cashBuy/application.json";

export async function fundBuyerBox(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string,
  amount: number
) {
  try {
    console.log("fundBuyerBox", {
      sender,
      contractAddress,
      appId,
      network,
      amount,
    });

    const contract = new algosdk.ABIContract(ABI.contract);
    let atc = new AtomicTransactionComposer();
    let sp = await Algod.getAlgod(network).getTransactionParams().do();

    // Create a transaction
    const ptxn = new Transaction({
      from: sender,
      to: contractAddress,
      amount: amount,
      note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
      ...sp,
    });
    const tws = {
      txn: ptxn,
      signer: AlgoSigner,
    };
    atc.addTransaction(tws);

    // // Reserve Box
    // let boxSizeInBytes = 1024;
    // atc.addMethodCall({
    //   appID: appId,
    //   method: contract.getMethodByName(`edit_buyer_note_box`),
    //   methodArgs: ["".padEnd(boxSizeInBytes, " ")] as ABIArgument[],
    //   sender: sender,
    //   suggestedParams: sp,
    //   note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
    //   signer: AlgoSigner,
    //   boxes: [
    //     {
    //       appIndex: appId,
    //       name: new Uint8Array(Buffer.from("Buyer", "utf8")),
    //     },
    //   ],
    // });

    const tx_id = await atc.submit(Algod.getAlgod(network));
    console.log("submit_response", tx_id);
    showSuccessToast("Request to fund buyer box sent to network");
  } catch (e) {
    showErrorToast("Error occurred when sending fund buyer box request");
    console.error(e);
  }
}
