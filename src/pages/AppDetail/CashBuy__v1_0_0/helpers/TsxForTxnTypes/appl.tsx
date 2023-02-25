import React from "react";
import Table from "react-bootstrap/Table";
import get from "lodash/get";
import { Buffer } from "buffer";
import algosdk, {
  encodeAddress,
  decodeUint64,
  encodeUint64,
  decodeObj,
  ABIContract,
} from "algosdk";

import ABI from "../../../../../contractExports/contracts/cashBuy/application.json";

// function buf2hex(buffer) {
//   // buffer is an ArrayBuffer
//   return [...new Uint8Array(buffer)]
//     .map((x) => x.toString(16).padStart(2, "0"))
//     .join("");
// }

// function buf2hex(buffer: any) {
//   return buffer
//     .map((x: any) => {
//       return x.toString(16).padStart(2, "0");
//     })
//     .join("");
// }

function arrayBufferToString(buffer: any) {
  console.log("___ ___ ___", "arrayBufferToString");
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return binary;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function buildMethodNameTsx(txn: any): string {
  let methodSelector = get(txn, "application-transaction.application-args.0");

  // console.log("appArgs", appArgs);
  // console.log("ABI", ABI.contract);
  // console.log("new ", new ABIContract(ABI.contract));

  let humanReadableMethodName = `Unsupported Method in latest ABI`;

  let abiContract = new ABIContract(ABI.contract);
  for (let i = 0; i < abiContract.methods.length; i++) {
    // console.log("i", abiContract.methods[i]);
    // console.log(
    //   "getSelector",
    //   arrayBufferToBase64(abiContract.methods[i].getSelector().buffer)
    // );

    if (
      arrayBufferToBase64(abiContract.methods[i].getSelector().buffer) ===
      methodSelector
    ) {
      return abiContract.methods[i].name;
    }
  }

  return humanReadableMethodName;

  // vvv VERY IMPORTANT DO NOT DELETE - how to decode address, uint64, and byteslices vvv
  // console.log(decodeUint64(Buffer.from("JqNEjw=="), "safe"));
  // console.log(decodeUint64(Buffer.from("AAAAAGPgBUQ=", "base64"), "safe"));
  // console.log(
  //   new Date(decodeUint64(Buffer.from("AAAAAGPgBUQ=", "base64"), "safe") * 1000)
  // );
  // console.log(
  //   encodeAddress(
  //     Buffer.from("cr1B0PeoBsWAlB8CL9hbOdSmIoCkdxwrVa+gSHMpo+g=", "base64")
  //   )
  // );
  // ^^^ VERY IMPORTANT DO NOT DELETE ^^^

  // let appID = get(txn, "application-transaction.application-id");

  // if (appID === 0) {
  //   return (
  //     <Table striped bordered hover>
  //       <thead>
  //         <tr>
  //           <th>Arg</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {/* {appArgs.map((i: string, idx: number) => {
  //           let decodedString = Buffer.from(i, "base64").toString();

  //           return (
  //             <tr>
  //               <td></td>
  //             </tr>
  //           );
  //         })} */}
  //       </tbody>
  //     </Table>
  //   );
  // } else {
  // }

  // try {
  //   return (
  //     <Table striped bordered hover>
  //       <thead>
  //         <tr>
  //           <th>Arg</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {appArgs.map((i: string, idx: number) => {
  //           let decodedString = Buffer.from(i, "base64").toString();

  //           return (
  //             <tr>
  //               <td></td>
  //             </tr>
  //           );
  //         })}
  //       </tbody>
  //     </Table>
  //   );
  // } catch (e) {
  //   console.log("e", e);
  // }
}

function buildAppArgsTsx(txn: any): string {
  let methodSelector = get(txn, "application-transaction.application-args.0");
  let appArgs = get(txn, "application-transaction.application-args");
  appArgs = appArgs.slice(1);

  console.log("methodSelector", methodSelector);
  console.log("appArgs -->", appArgs);
  // console.log("ABI", ABI.contract);
  // console.log("new ", new ABIContract(ABI.contract));
  // let humanReadableMethodName = `Unsupported Method in latest ABI`;

  // if (
  //   arrayBufferToBase64(methodName) === `edit_buyer_note_box`
  //   // ["edit_buyer_note_box"].includes(
  //   //   arrayBufferToBase64(abiContract.methods[i].getSelector().buffer)
  //   // )
  // ) {
  //   console.log("Loopty loop...");
  // }

  let abiContract = new ABIContract(ABI.contract);
  for (let i = 0; i < abiContract.methods.length; i++) {
    // console.log("i", abiContract.methods[i]);
    // console.log(
    //   "getSelector",
    //   arrayBufferToBase64(abiContract.methods[i].getSelector().buffer)
    // );
    if (
      arrayBufferToBase64(abiContract.methods[i].getSelector().buffer) ===
      methodSelector
    ) {
      if (abiContract.methods[i].name === "edit_buyer_note_box") {
        // console.log(
        //   "YOOO",
        //   Buffer.from(appArgs[0].slice(4), "base64").toString(),

        //   // Buffer.from(appArgs[0], "base64").toString("utf8")
        //   Buffer.from(appArgs[0], "base64").toString()
        // );

        return Buffer.from(appArgs[0], "base64").slice(2).toString();
      }
    }
  }

  return "WIP";

  // return humanReadableMethodName;

  // vvv VERY IMPORTANT DO NOT DELETE - how to decode address, uint64, and byteslices vvv
  // console.log(decodeUint64(Buffer.from("JqNEjw=="), "safe"));
  // console.log(decodeUint64(Buffer.from("AAAAAGPgBUQ=", "base64"), "safe"));
  // console.log(
  //   new Date(decodeUint64(Buffer.from("AAAAAGPgBUQ=", "base64"), "safe") * 1000)
  // );
  // console.log(
  //   encodeAddress(
  //     Buffer.from("cr1B0PeoBsWAlB8CL9hbOdSmIoCkdxwrVa+gSHMpo+g=", "base64")
  //   )
  // );
  // ^^^ VERY IMPORTANT DO NOT DELETE ^^^

  // let appID = get(txn, "application-transaction.application-id");

  // if (appID === 0) {
  //   return (
  //     <Table striped bordered hover>
  //       <thead>
  //         <tr>
  //           <th>Arg</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {/* {appArgs.map((i: string, idx: number) => {
  //           let decodedString = Buffer.from(i, "base64").toString();

  //           return (
  //             <tr>
  //               <td></td>
  //             </tr>
  //           );
  //         })} */}
  //       </tbody>
  //     </Table>
  //   );
  // } else {
  // }

  // try {
  //   return (
  //     <Table striped bordered hover>
  //       <thead>
  //         <tr>
  //           <th>Arg</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {appArgs.map((i: string, idx: number) => {
  //           let decodedString = Buffer.from(i, "base64").toString();

  //           return (
  //             <tr>
  //               <td></td>
  //             </tr>
  //           );
  //         })}
  //       </tbody>
  //     </Table>
  //   );
  // } catch (e) {
  //   console.log("e", e);
  // }
}

export function buildTsxForAppl(txn: any) {
  // console.log("txn", txn);

  let methodName = buildMethodNameTsx(txn);
  let appArgs = buildAppArgsTsx(txn);

  return (
    <div key={get(txn, "id")} className="mb-4">
      <span>
        {new Date(get(txn, "round-time", -1) * 1000).toLocaleString()}
      </span>
      <br />
      <span>Note: </span>&nbsp;
      <span>{Buffer.from(get(txn, "note", ""), "base64").toString()}</span>
      <br />
      <span>Txn Type: </span>&nbsp;
      <span>{get(txn, "tx-type", "ø")}</span>
      <br />
      <span>method: </span>&nbsp;
      <span>{methodName}</span>
      <br />
      <span>Args: </span>&nbsp;
      <span>{appArgs}</span>
      <br />
    </div>
  );
}
