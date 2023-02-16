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
          [`glbl_buyer_update`, `glbl_seller_update`],
          {
            [`glbl_buyer_update`]: "(address,address,uint64,uint64,uint64)",
            [`glbl_seller_update`]: "(address,address,uint64,uint64,uint64)",
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
    globalState.val && globalState.val[`glbl_${role}_update`];

  if (roleRequestedRevision && globalState.val) {
    console.log(globalState.val["glbl_escrow_1"]);
    console.log(roleRequestedRevision[2]);
    console.log(typeof roleRequestedRevision[2]);

    console.log(
      BigInt(globalState.val["glbl_escrow_1"]) !==
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
            <span>{globalState.val["glbl_buyer"]}</span>
            {globalState.val["glbl_buyer"] !== roleRequestedRevision[0] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {roleRequestedRevision[0]}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Seller </b>
            <span>{globalState.val["glbl_seller"]}</span>
            {globalState.val["glbl_seller"] !== roleRequestedRevision[0] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {roleRequestedRevision[1]}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Escrow Amount 1 </b>
            <span>{globalState.val["glbl_escrow_1"]}</span>
            {BigInt(globalState.val["glbl_escrow_1"]) !==
              roleRequestedRevision[2] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(roleRequestedRevision[2])}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Escrow Amount 2 </b>
            <span>{globalState.val["glbl_escrow_2"]}</span>
            {BigInt(globalState.val["glbl_escrow_2"]) !==
              roleRequestedRevision[3] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(roleRequestedRevision[3])}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Escrow Total </b>
            <span>{globalState.val["glbl_total"]}</span>
            {BigInt(globalState.val["glbl_total"]) !==
              roleRequestedRevision[4] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {" -> "}
                {toObject(roleRequestedRevision[4])}
              </span>
            )}
          </div>
          {/*  */}
          <div>
            <b>Inspect Start Date</b>
            <span>{globalState.val["glbl_inspect_start_date"]}</span>
            {/* {globalState.val["glbl_inspect_start_date"] !==
              roleRequestedRevision[5] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[5]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Inspect End Date</b>
            <span>{globalState.val["glbl_inspect_end_date"]}</span>
            {/* {globalState.val["glbl_inspect_end_date"] !==
              roleRequestedRevision[6] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[6]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Inspect Extension</b>
            <span>{globalState.val["glbl_inspect_extension_date"]}</span>
            {/* {globalState.val["glbl_inspect_extension_date"] !==
              roleRequestedRevision[7] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[7]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Moving Date</b>
            <span>{globalState.val["glbl_moving_date"]}</span>
            {/* {globalState.val["glbl_moving_date"] !==
              roleRequestedRevision[8] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[8]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Closing Date</b>
            <span>{globalState.val["glbl_closing_date"]}</span>
            {/* {globalState.val["glbl_closing_date"] !==
              roleRequestedRevision[9] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[9]}
              </span>
            )} */}
          </div>
          {/*  */}
          <div>
            <b>Free Funds Date</b>
            <span>{globalState.val["glbl_free_funds_date"]}</span>
            {/* {globalState.val["glbl_free_funds_date"] !==
              roleRequestedRevision[10] && (
              <span
                style={{
                  color: "green",
                }}
              >
                {roleRequestedRevision[10]}
              </span>
            )} */}
          </div>
        </>
      ) : (
        "ø"
      )}
    </>
  );
}
