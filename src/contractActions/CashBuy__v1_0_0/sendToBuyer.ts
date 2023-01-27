import algosdk, { AtomicTransactionComposer, ABIArgument } from "algosdk";
import { Algod } from "../../services/algod";
import { Buffer } from "buffer";
import { showSuccessToast } from "../../utility/successToast";
import { showErrorToast } from "../../utility/errorToast";
import { supportedContracts } from "../../data/supportedContracts";

import ABI from "../../contractExports/contracts/cashBuy/application.json";
import { signer as AlgoSigner } from "../helpers/signers/AlgoSigner";

export async function sendToBuyer(
  sender: string,
  contractAddress: string,
  appId: number,
  network: string
) {
  try {
    console.log("sendToBuyer");
    showSuccessToast("sendToBuyer");
  } catch (e) {
    showErrorToast("Error sendToBuyer");
    console.error(e);
  }
}
