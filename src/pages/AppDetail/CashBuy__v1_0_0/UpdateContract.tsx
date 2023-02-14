import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
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

export function UpdateContract() {
  const [app, setApp] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });
  const settings = useAppSelector((state: RootState) => state.settings);
  let { id } = useParams();

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

        console.log(
          "_-_-_",
          decodeUint64(
            Buffer.from("Z2xvYmFsX3NlbGxlcl9jb250cmFjdF91cGRhdGU=", "base64"),
            "safe"
          )
        );

        setApp({
          val: parseGlobalState(
            appResponse?.application?.params &&
              appResponse.application.params["global-state"]
          ),
          loading: false,
          error: null,
        });
        const appAddress = await algosdk.getApplicationAddress(
          Number.parseInt(id!)
        );
        // STEP 2
        // const accountResponse = await Algod.getAlgod(
        //   settings.selectedAlgorandNetwork
        // )
        //   .accountInformation(appAddress)
        //   .do();

        // setAccount({
        //   val: accountResponse,
        //   loading: false,
        //   error: null,
        // });
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

  useEffect(() => {
    // async function fetch() {
    //   const contract = new algosdk.ABIContract(ABI.contract);
    //   let atc = new AtomicTransactionComposer();
    //   let params = await Algod.getAlgod(settings.selectedAlgorandNetwork)
    //     .getTransactionParams()
    //     .do();
    //   atc.addMethodCall({
    //     appID: Number.parseInt(id!),
    //     method: contract.getMethodByName(
    //       "get_seller_requested_contract_update"
    //     ),
    //     methodArgs: [] as ABIArgument[],
    //     sender: settings.selectedAlgorandAccount,
    //     suggestedParams: params,
    //     note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
    //     signer: signer,
    //   });
    //   const tx_id = await atc.submit(
    //     Algod.getAlgod(settings.selectedAlgorandNetwork)
    //   );
    //   console.log("submit_response", tx_id);
    //   showSuccessToast("Get seller update contract request sent to network!");
    //   showSuccessToast("Awaiting block confirmation...");
    //   const res = await algosdk.waitForConfirmation(
    //     Algod.getAlgod(settings.selectedAlgorandNetwork),
    //     tx_id[0],
    //     32
    //   );
    //   console.log("*** res ***", res);
    // }
    // fetch();
  }, []);

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

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);
      const { buyer, seller, escrowAmount1, escrowAmount2, escrowTotal } = data;
      console.log("onSubmit");
      console.log("errors", errors);

      let escrowAmount1AsInt = escrowAmount1;
      try {
        escrowAmount1AsInt =
          Number(escrowAmount1.replace(/[^0-9.-]+/g, "")) * 100;
      } catch (e) {}
      let escrowAmount2AsInt = escrowAmount2;
      try {
        escrowAmount2AsInt =
          Number(escrowAmount2.replace(/[^0-9.-]+/g, "")) * 100;
      } catch (e) {}
      let escrowTotalAsInt = escrowTotal;
      try {
        escrowTotalAsInt = Number(escrowTotal.replace(/[^0-9.-]+/g, "")) * 100;
      } catch (e) {}

      const contract = new algosdk.ABIContract(ABI.contract);
      let atc = new AtomicTransactionComposer();
      let params = await Algod.getAlgod(settings.selectedAlgorandNetwork)
        .getTransactionParams()
        .do();

      atc.addMethodCall({
        appID: Number.parseInt(id!),
        method: contract.getMethodByName("seller_request_contract_update"),
        methodArgs: [
          buyer, // global_buyer: "",
          seller, // global_seller: "",
          Math.floor(escrowAmount1AsInt), // global_escrow_payment_1: "",
          Math.floor(escrowAmount2AsInt), // global_escrow_payment_2: "",
          Math.floor(escrowTotalAsInt), // global_total_price: "",
          // moment(inspectionPeriodStart).unix(), // global_inspection_start_date: "",
          // moment(inspectionPeriodEnd).unix(), // global_inspection_end_date: "",
          // moment(inspectionPeriodExtension).unix(), // global_inspection_extension_date: "",
          // moment(movingDate).unix(), // global_moving_date: "",
          // moment(closingDate).unix(), // global_closing_date: "",
          // moment(freeFundsDate).unix(), // global_free_funds_date: "",
          // asaId === "-1" ? Math.floor(customAsaId) : Number.parseInt(asaId), // global_asa_id: ""
        ] as ABIArgument[],
        sender: settings.selectedAlgorandAccount,
        suggestedParams: params,
        note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
        signer: signer,
      });

      const tx_id = await atc.submit(
        Algod.getAlgod(settings.selectedAlgorandNetwork)
      );

      console.log("submit_response", tx_id);

      showSuccessToast("Update contract request sent to network!");

      showSuccessToast("Awaiting block confirmation...");
      await algosdk.waitForConfirmation(
        Algod.getAlgod(settings.selectedAlgorandNetwork),
        tx_id[0],
        32
      );
    } catch (e) {
      console.error(e);
    }
  };

  console.log("app", app);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h1>Revise Cash Buy Contract</h1>
      </div>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm={4} className="mb-3">
                <Form.Group id="escrow-amount-1">
                  <Form.Label>Escrow 1</Form.Label>
                  <Form.Control
                    {...register("escrowAmount1", { required: true })}
                    type="tel"
                    inputMode="numeric"
                    pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                    placeholder="Amount 1"
                    onBlur={(event) => {
                      let result = formatCurrency(event.target, true);
                      event.target.value = result.input_val;
                      setValue("escrowAmount1", result.input_val);
                      trigger("escrowTotal");
                    }}
                    onChange={(event) => {
                      let result = formatCurrency(event.target, false, false);
                      event.target.value = result.input_val;
                      event.target.setSelectionRange(
                        result.caret_pos,
                        result.caret_pos
                      );
                    }}
                  />
                </Form.Group>
              </Col>
              <Col sm={4} className="mb-3">
                <Form.Group id="escrow-amount-2">
                  <Form.Label>Escrow 2</Form.Label>
                  <Form.Control
                    {...register("escrowAmount2", { required: true })}
                    type="tel"
                    inputMode="numeric"
                    pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                    placeholder="Amount 2"
                    onBlur={(event) => {
                      let result = formatCurrency(event.target, true);
                      event.target.value = result.input_val;
                      setValue("escrowAmount2", result.input_val);
                      trigger("escrowTotal");
                    }}
                    onChange={(event) => {
                      let result = formatCurrency(event.target, false, false);
                      event.target.value = result.input_val;
                      event.target.setSelectionRange(
                        result.caret_pos,
                        result.caret_pos
                      );
                    }}
                  />
                </Form.Group>
              </Col>
              <Col sm={4} className="mb-3">
                <Form.Group id="escrow-total">
                  <Form.Label>Total Price</Form.Label>
                  <Form.Control
                    {...register("escrowTotal", {
                      // required: true,
                      validate: (value, formValues) => {
                        // console.log("value", value);
                        // console.log("formValues", formValues);

                        let escrowAmount1AsInt;
                        try {
                          escrowAmount1AsInt =
                            Number(
                              formValues.escrowAmount1.replace(/[^0-9.-]+/g, "")
                            ) * 100;
                        } catch (e) {}
                        let escrowAmount2AsInt;
                        try {
                          escrowAmount2AsInt =
                            Number(
                              formValues.escrowAmount2.replace(/[^0-9.-]+/g, "")
                            ) * 100;
                        } catch (e) {}
                        let escrowTotalAsInt;
                        try {
                          escrowTotalAsInt =
                            Number(
                              formValues.escrowTotal.replace(/[^0-9.-]+/g, "")
                            ) * 100;
                        } catch (e) {}

                        if (
                          escrowAmount1AsInt &&
                          escrowAmount2AsInt &&
                          escrowAmount1AsInt + escrowAmount2AsInt ===
                            escrowTotalAsInt
                        ) {
                          return true;
                        } else {
                          return "Escrow ≠ Total";
                        }
                      },
                    })}
                    type="tel"
                    inputMode="numeric"
                    pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$"
                    placeholder="Total Price"
                    isInvalid={errors["escrowTotal"] ? true : false}
                    onBlur={(event) => {
                      let result = formatCurrency(event.target, true);
                      event.target.value = result.input_val;
                      setValue("escrowTotal", result.input_val);
                      trigger("escrowTotal");
                    }}
                    onChange={(event) => {
                      let result = formatCurrency(event.target, false, false);
                      event.target.value = result.input_val;
                      event.target.setSelectionRange(
                        result.caret_pos,
                        result.caret_pos
                      );
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.escrowTotal?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="align-items-center">
              <Col sm={12} className="mb-3">
                <Form.Group id="buyerAddress">
                  <Form.Label>Buyer Address</Form.Label>
                  <Form.Control
                    {...register("buyer", {
                      required: true,
                    })}
                    type="text"
                    placeholder="Buyer Wallet Address"
                  />
                </Form.Group>
              </Col>
              <Col sm={12} className="mb-3">
                <Form.Group id="sellerAddress">
                  <Form.Label>Seller</Form.Label>
                  <Form.Control
                    {...register("seller", {
                      required: true,
                    })}
                    type="text"
                    placeholder="Seller Wallet Address"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mt-3">
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
