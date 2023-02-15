import React from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import get from "lodash/get";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { RootState } from "../../../../store/store";
import ABI from "../../../../contractExports/contracts/cashBuy/application.json";
import { signer } from "../../../../contractActions/helpers/signers/AlgoSigner";

import { showErrorToast } from "../../../../utility/errorToast";
import { showSuccessToast } from "../../../../utility/successToast";
import { supportedContracts } from "../../../../data/supportedContracts";
import { formatCurrency } from "../../../../components/Forms/helpers/formatCurrency";
import { Buffer } from "buffer";
import { supportedStablecoins } from "../../../../components/Forms/helpers/supportedStablecoins";

import { Algod } from "../../../../services/algod";

import { Tooltip } from "./Tooltip";

import algosdk, {
  AtomicTransactionComposer,
  ABIArgument,
  Account,
  decodeUint64,
} from "algosdk";

function moveDecimal(n: bigint, moveDecimalLeftBy: number) {
  // var l = n.toString().length - 0;
  // var v = n / Math.pow(10, l);

  n /= BigInt(Math.pow(10, moveDecimalLeftBy));
  return n;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
});

interface P {
  selectedAccount: string;
  globalState: any;
}

export function UpdateContractForm(props: P) {
  const { globalState } = props;

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
      // buyer: "YRRGGYPFQYUIKHTYCWL3V7FGMDNNVZ46QJKE6GQQDURQL3NIVUIUFQSXAY",
      // seller: "YRRGGYPFQYUIKHTYCWL3V7FGMDNNVZ46QJKE6GQQDURQL3NIVUIUFQSXAY",
      // escrowAmount1: "$100,000.00",
      // escrowAmount2: "$100,000.00",
      // escrowTotal: "$200,000.00",
      buyer: "",
      seller: "",
      escrowAmount1: "",
      escrowAmount2: "",
      escrowTotal: "",
    },
  });

  const settings = useAppSelector((state: RootState) => state.settings);
  let { id } = useParams();

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);
      const { buyer, seller, escrowAmount1, escrowAmount2, escrowTotal } = data;
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

      console.log(
        "*** role ***",
        settings.selectedAlgorandAccount,
        globalState
      );

      let methodByName = ``;
      if (
        settings.selectedAlgorandAccount === get(globalState, `global_buyer`)
      ) {
        methodByName = `buyer_request_contract_update`;
      } else if (
        settings.selectedAlgorandAccount === get(globalState, `global_seller`)
      ) {
        methodByName = `seller_request_contract_update`;
      } else {
        showErrorToast("Invalid Role");
        return;
      }

      atc.addMethodCall({
        appID: Number.parseInt(id!),
        method: contract.getMethodByName(methodByName),
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

      showSuccessToast("Proposed Revision request was successful...");
    } catch (e) {
      console.error(e);
    }
  };

  let role = ``;
  if (settings.selectedAlgorandAccount === get(globalState, `global_buyer`)) {
    role = `Buyer`;
  } else if (
    settings.selectedAlgorandAccount === get(globalState, `global_seller`)
  ) {
    role = `Seller`;
  } else {
    role = "N/A";
  }

  console.log("globalState", globalState);

  return (
    <>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Header>
          <Tooltip />
          Role: {role}
          <br />
          <Button
            variant="info"
            className="m-1"
            onClick={() => {
              if (globalState["global_buyer_update"]) {
                const escrow1FORMATTED = `$${formatter.format(
                  moveDecimal(globalState["global_buyer_update"][2], 2)
                )}`;
                const escrow2FORMATTED = `$${formatter.format(
                  moveDecimal(globalState["global_buyer_update"][3], 2)
                )}`;
                const escrowTotalFORMATTED = `$${formatter.format(
                  moveDecimal(globalState["global_buyer_update"][4], 2)
                )}`;

                setValue("buyer", globalState["global_buyer_update"][0]);
                setValue("seller", globalState["global_buyer_update"][1]);
                setValue("escrowAmount1", escrow1FORMATTED);
                setValue("escrowAmount2", escrow2FORMATTED);
                setValue("escrowTotal", escrowTotalFORMATTED);
              } else {
                showErrorToast("No Buyer Proposed Revision");
              }
            }}
          >
            Load Buyer Proposed Revision
          </Button>
          <br />
          <Button
            variant="info"
            className="m-1"
            onClick={() => {
              if (globalState["global_seller_update"]) {
                const escrow1FORMATTED = `$${formatter.format(
                  moveDecimal(globalState["global_seller_update"][2], 2)
                )}`;
                const escrow2FORMATTED = `$${formatter.format(
                  moveDecimal(globalState["global_seller_update"][3], 2)
                )}`;
                const escrowTotalFORMATTED = `$${formatter.format(
                  moveDecimal(globalState["global_seller_update"][4], 2)
                )}`;

                setValue("buyer", globalState["global_seller_update"][0]);
                setValue("seller", globalState["global_seller_update"][1]);
                setValue("escrowAmount1", escrow1FORMATTED);
                setValue("escrowAmount2", escrow2FORMATTED);
                setValue("escrowTotal", escrowTotalFORMATTED);
              } else {
                showErrorToast("No Seller Proposed Revision");
              }
            }}
          >
            Load Seller Proposed Revision
          </Button>
        </Card.Header>
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
                Update
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
