import algosdk from "algosdk";
import { Buffer } from "buffer";

export function parseGlobalState(arg: any) {
  try {
    const isIterable = (value: any) => {
      return Symbol.iterator in Object(value);
    };

    console.log("isIterable", isIterable(arg));

    if (isIterable(arg)) {
      const r: any = {};

      arg.forEach((d: any) => {
        const key = Buffer.from(d.key, "base64").toString("utf8");
        let value = null;

        if (d.value.bytes) {
          const b = new Uint8Array(Buffer.from(d.value.bytes, "base64"));
          value = algosdk.encodeAddress(b);

          if (!algosdk.isValidAddress(value)) {
            value = Buffer.from(d.value.bytes, "base64").toString();
          }
        } else {
          value = d.value.uint;
        }

        r[key] = value;
      });

      return r;
    } else {
      throw new Error("non-iterable object passed to `parseGlobalState`");
    }
  } catch (e) {
    throw e;
  }
}
