import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Card, Form, Button, Accordion } from "react-bootstrap";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { formatCurrency } from "../../../components/Forms/helpers/formatCurrency";
import { Buffer } from "buffer";
import { supportedStablecoins } from "../../../components/Forms/helpers/supportedStablecoins";
import { RootState } from "../../../store/store";
import moment from "moment-timezone";
import { parseGlobalState } from "../../customSelectors/appl/parseGlobalState";
import { Algod } from "../../../services/algod";

import ABI from "../../../contractExports/contracts/cashBuy/application.json";
import { signer } from "../../../contractActions/helpers/signers/AlgoSigner";

import { showErrorToast } from "../../../utility/errorToast";
import { showSuccessToast } from "../../../utility/successToast";
import { supportedContracts } from "../../../data/supportedContracts";

import algosdk, {
  AtomicTransactionComposer,
  ABIArgument,
  Account,
  decodeUint64,
} from "algosdk";
import { ProposedRevisionDiff } from "./UpdateContractComponents/ProposedRevisionDiff";
import { UpdateContractForm } from "./UpdateContractComponents/UpdateContractForm";

export function UpdateContract() {
  const [app, setApp] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });
  const settings = useAppSelector((state: RootState) => state.settings);
  let { id } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      buyer: "YRRGGYPFQYUIKHTYCWL3V7FGMDNNVZ46QJKE6GQQDURQL3NIVUIUFQSXAY",
      seller: "YRRGGYPFQYUIKHTYCWL3V7FGMDNNVZ46QJKE6GQQDURQL3NIVUIUFQSXAY",
      escrowAmount1: "$100,000.00",
      escrowAmount2: "$100,000.00",
      escrowTotal: "$200,000.00",
    },
  });

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

        setApp({
          val: parseGlobalState(
            appResponse?.application?.params &&
              appResponse.application.params["global-state"],
            ["global_buyer_update", "global_seller_update"],
            {
              global_seller_update: "(address,address,uint64,uint64,uint64)",
              global_buyer_update: "(address,address,uint64,uint64,uint64)",
            }
          ),
          loading: false,
          error: null,
        });
        // const appAddress = await algosdk.getApplicationAddress(
        //   Number.parseInt(id!)
        // );

        // setValue("escrowAmount1", "$11,111.11");
      } catch (e) {
        console.log("e", e);

        // setApp({
        //   val: null,
        //   loading: false,
        //   error: e,
        // });
      }
    }

    fetch();
  }, []);

  console.log("app", app);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h1>Revise Contract</h1>
      </div>
      <Accordion defaultActiveKey="0" alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Last Seller Proposed Revision</Accordion.Header>
          <Accordion.Body>
            <ProposedRevisionDiff role="seller" />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Last Buyer Proposed Revision</Accordion.Header>
          <Accordion.Body>
            <ProposedRevisionDiff role="buyer" />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Propose Revision</Accordion.Header>
          <Accordion.Body>
            <UpdateContractForm
              selectedAccount={settings.selectedAlgorandAccount}
              globalState={get(app, "val", null)}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
