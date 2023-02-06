import algosdk from "algosdk";
import { Buffer } from "buffer";

export async function signer(
  unsignedTxns: Array<algosdk.Transaction>
): Promise<Uint8Array[]> {
  // console.log("unsignedTxns", unsignedTxns);

  // let binaryTx = appCreateTxn.toByte();

  let signedTxns = await (window as any).AlgoSigner.signTxn(
    unsignedTxns.map((_txn) => {
      return {
        txn: (window as any).AlgoSigner.encoding.msgpackToBase64(_txn.toByte()),
      };
    })
  );

  return signedTxns.map((sTxn: any) => {
    // console.log("sTxn", sTxn);
    return Uint8Array.from(Buffer.from(sTxn.blob, "base64"));
  });
}
