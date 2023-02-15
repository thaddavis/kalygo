import React, { useEffect, useState } from "react";
import { Algod } from "../../../../services/algod";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { useParams } from "react-router-dom";
import { RootState } from "../../../../store/store";
import { parseGlobalState } from "../../../customSelectors/appl/parseGlobalState";

import { ContractUpdate } from "../../../../types/contractUpdate";

interface P {
  role: string;
}

export function ProposedRevisionDiff(props: P) {
  let { role } = props;

  const [globalState, setGlobalState] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  const settings = useAppSelector((state: RootState) => state.settings);
  let { id } = useParams();

  function toObject(val: any) {
    return JSON.parse(
      JSON.stringify(
        val,
        (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
      )
    );
  }

  useEffect(() => {
    async function fetch() {
      try {
        // STEP 1
        const appResponse = await Algod.getIndexer(
          settings.selectedAlgorandNetwork
        )
          .lookupApplications(Number.parseInt(id!))
          .do();

        // console.log("appResponse", appResponse);

        const gState = parseGlobalState(
          appResponse?.application?.params &&
            appResponse.application.params["global-state"],
          [`global_buyer_update`, `global_seller_update`],
          {
            [`global_buyer_update`]: "(address,address,uint64,uint64,uint64)",
            [`global_seller_update`]: "(address,address,uint64,uint64,uint64)",
          }
        );

        // let proposedUpdate: ContractUpdate =
        //   gState[`global_${role}_update`] || "ø";

        setGlobalState({
          val: gState,
          loading: false,
          error: null,
        });
        // const appAddress = await algosdk.getApplicationAddress(
        //   Number.parseInt(id!)
        // );

        // setValue("escrowAmount1", "$11,111.11");
      } catch (e) {
        console.log("e", e);

        setGlobalState({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    fetch();
  }, []);

  console.log(`globalState.val`, globalState.val);

  let roleRequestedRevision =
    globalState.val && globalState.val[`global_${role}_update`];

  if (roleRequestedRevision && globalState.val) {
    console.log(globalState.val["global_escrow_payment_1"]);
    console.log(roleRequestedRevision[2]);
    console.log(typeof roleRequestedRevision[2]);

    console.log(
      BigInt(globalState.val["global_escrow_payment_1"]) !==
        toObject(roleRequestedRevision[2])
    );
  }

  return (
    <>
      {/* {globalState.val && (
          <pre>{JSON.stringify(toObject(globalState.val), undefined, 2)}</pre>
        )} */}
      {roleRequestedRevision && globalState.val ? (
        <>
          <div>
            <b>Buyer </b>
            <span
              style={{
                color:
                  globalState.val["global_buyer"] !== roleRequestedRevision[0]
                    ? "green"
                    : "#4A5073",
              }}
            >
              {globalState.val["global_buyer"]}
              {" > "}
              {roleRequestedRevision[0]}
            </span>
          </div>
          {/*  */}
          <div>
            <b>Seller </b>
            <span
              style={{
                color:
                  globalState.val["global_seller"] !== roleRequestedRevision[0]
                    ? "green"
                    : "#4A5073",
              }}
            >
              {globalState.val["global_seller"]}
              {" > "}
              {roleRequestedRevision[1]}
            </span>
          </div>
          {/*  */}
          <div>
            <b>Escrow Amount 1 </b>
            <span>{globalState.val["global_escrow_payment_1"]}</span>
            {" > "}
            <span
              style={{
                color:
                  BigInt(globalState.val["global_escrow_payment_1"]) !==
                  roleRequestedRevision[2]
                    ? "green"
                    : "#4A5073",
              }}
            >
              {toObject(roleRequestedRevision[2])}
            </span>
          </div>
          {/*  */}
          <div>
            <b>Escrow Amount 2 </b>
            <span>{globalState.val["global_escrow_payment_2"]}</span>
            {" > "}
            <span
              style={{
                color:
                  BigInt(globalState.val["global_escrow_payment_2"]) !==
                  roleRequestedRevision[3]
                    ? "green"
                    : "#4A5073",
              }}
            >
              {toObject(roleRequestedRevision[3])}
            </span>
          </div>
          {/*  */}
          <div>
            <b>Escrow Total </b>
            <span>{globalState.val["global_total_price"]}</span>
            {" > "}
            <span
              style={{
                color:
                  BigInt(globalState.val["global_total_price"]) !==
                  roleRequestedRevision[4]
                    ? "green"
                    : "#4A5073",
              }}
            >
              {toObject(roleRequestedRevision[4])}
            </span>
          </div>
        </>
      ) : (
        "ø"
      )}
    </>
  );
}
