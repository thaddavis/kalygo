import algosdk from "algosdk";
import { Buffer } from "buffer";

// helper function to compile program source
export async function compileProgram(
  client: algosdk.Algodv2,
  programSource: string
) {
  let encoder = new TextEncoder();
  let programBytes = encoder.encode(programSource);
  let compileResponse = await client.compile(programBytes).do();
  let compiledBytes = new Uint8Array(
    Buffer.from(compileResponse.result, "base64")
  );

  return compiledBytes;
}
