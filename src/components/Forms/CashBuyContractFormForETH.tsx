import React, { useEffect, useState } from "react";
import { Col, Row, Card, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import moment from "moment-timezone";
import { Buffer } from "buffer";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Algod } from "../../services/algod";
import { compileProgram } from "../../ABI/utility/compileProgram";
import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

import algosdk, {
  AtomicTransactionComposer,
  ABIArgument,
  Account,
} from "algosdk";

import { formatCurrency } from "./helpers/formatCurrency";

import ABI from "../../contractExports/contracts/cashBuy/application.json";
import { signer } from "../../contractActions/helpers/signers/AlgoSigner";

interface P {
  accounts: string[];
}

export const CashBuyContractForm = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    trigger,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
    control,
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      escrowAmount1: "$100,000.00",
      escrowAmount2: "$100,000.00",
      escrowTotal: "$200,000.00",
      // asaId: 95939489,
      asaId: 12,
      inspectPeriodStart: moment().add("1", "m").add("0", "s").toString(),
      inspectPeriodEnd: moment().add("2", "m").toString(),
      inspectPeriodExtension: moment().add("3", "m").toString(),
      movingDate: moment().add("3", "m").add("30", "s").toString(),
      closingDate: moment().add("4", "m").toString(),
      freeFundsDate: moment().add("4", "m").add("30", "s").toString(),
      // inspectPeriodStart: moment().add("30", "s").toString(),
      // inspectPeriodEnd: moment().add("60", "s").toString(),
      // inspectPeriodExtension: moment().add("90", "s").toString(),
      // movingDate: moment().add("120", "s").toString(),
      // closingDate: moment().add("150", "s").toString(),
      // freeFundsDate: moment().add("180", "s").toString(),
      buyer: "F2BLSIT7DMRXBVE6OT53U3UNTN7KAF36LW5AW6SOBKJSKTMCMXRATIU64A",
      seller: "F2BLSIT7DMRXBVE6OT53U3UNTN7KAF36LW5AW6SOBKJSKTMCMXRATIU64A",
      propertyAddress: "3717 Royal Palm Ave.",
      propertyName: "Yellow House On Mid Miami Beach",
      enableTimeChecks: true,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);

      const {
        buyer,
        seller,
        escrowAmount1,
        escrowAmount2,
        escrowTotal,
        inspectPeriodStart,
        inspectPeriodEnd,
        inspectPeriodExtension,
        movingDate,
        closingDate,
        freeFundsDate,
        enableTimeChecks,
        propertyAddress,
        propertyName,
        asaId,
      } = data;

      // console.log(
      //   "escrowAmount1",
      //   escrowAmount1,
      //   escrowAmount1.replace(/[^0-9.-]+/g, ""),
      //   Number(escrowAmount1.replace(/[^0-9.-]+/g, ""))
      // );

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

      let onComplete = algosdk.OnApplicationComplete.NoOpOC;

      let a_prog = await compileProgram(
        Algod.getAlgod(settings.selectedAlgorandNetwork),
        Buffer.from(ABI.source.approval, "base64").toString()
      );
      let c_prog = await compileProgram(
        Algod.getAlgod(settings.selectedAlgorandNetwork),
        Buffer.from(ABI.source.clear, "base64").toString()
      );

      atc.addMethodCall({
        appID: 0,
        method: contract.getMethodByName("create"),
        methodArgs: [
          buyer, // glbl_buyer: "",
          seller, // glbl_seller: "",
          Math.floor(escrowAmount1AsInt), // glbl_escrow_1: "",
          Math.floor(escrowAmount2AsInt), // glbl_escrow_2: "",
          Math.floor(escrowTotalAsInt), // glbl_total: "",
          moment(inspectPeriodStart).unix(), // glbl_inspect_start_date: "",
          moment(inspectPeriodEnd).unix(), // glbl_inspect_end_date: "",
          moment(inspectPeriodExtension).unix(), // glbl_inspect_extension_date: "",
          moment(movingDate).unix(), // glbl_moving_date: "",
          moment(closingDate).unix(), // glbl_closing_date: "",
          moment(freeFundsDate).unix(), // glbl_free_funds_date: "",
          Math.floor(asaId), // glbl_asa_id: ""
        ] as ABIArgument[],
        approvalProgram: a_prog,
        clearProgram: c_prog,
        numGlobalByteSlices: 3,
        numGlobalInts: 13,
        numLocalByteSlices: 0,
        numLocalInts: 0,
        sender: settings.selectedAlgorandAccount,
        suggestedParams: params,
        note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
        signer: signer,
        onComplete: onComplete,
      });

      const tx_id = await atc.submit(
        Algod.getAlgod(settings.selectedAlgorandNetwork)
      );

      console.log("submit_response", tx_id);

      showSuccessToast("Contract creation request sent to network!");

      showSuccessToast("Awaiting block confirmation...");
      await algosdk.waitForConfirmation(
        Algod.getAlgod(settings.selectedAlgorandNetwork),
        tx_id[0],
        32
      );

      navigate(`/dashboard/transactions`);
    } catch (e) {
      showErrorToast(
        "Something unexpected happened. Make sure your wallet is connected."
      );
      console.error(e);
    }
  };

  console.log("errors", errors);
  console.log("isValid", isValid);

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)} id="cash-buy-contract-form">
          <h5 className="mb-4">Contract Details</h5>
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
                    let result = formatCurrency(event.target, false);
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
                    let result = formatCurrency(event.target, false);
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
                    let result = formatCurrency(event.target, false);
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
              <Form.Group id="seller">
                <Form.Label>Stablecoin (ie: USDC)</Form.Label>
                {/* <Form.Control
                  {...register("asaId", {
                    required: true,
                  })}
                  type="number"
                  placeholder="ASA id"
                /> */}
                <Form.Select
                  {...register("asaId", { required: true })}
                  onChange={(e: React.FormEvent<EventTarget>) => {
                    let target = e.target as HTMLSelectElement;
                  }}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {[
                    {
                      symbol: "USDC",
                      tokenId: 12,
                    },
                    "Tether",
                    "DAI",
                  ].map((i: any, idx: number) => {
                    return (
                      <option
                        key={i}
                        disabled={
                          ["USDC", "Tether", "DAI"].includes(i) ? false : true
                        }
                        style={{
                          textOverflow: "ellipsis",
                        }}
                        value={i}
                      >
                        {i}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="inspect-period-start">
                <Form.Label>Inspection Period Start</Form.Label>
                <Datetime
                  timeFormat={true}
                  onChange={(e: any) => {
                    // console.log("e", e.unix());

                    setValue("inspectPeriodStart", e.toString());
                  }}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("inspectPeriodStart", {
                          required: true,
                        })}
                        type="text"
                        value={getValues("inspectPeriodStart")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                        }}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="inspect-period-end">
                <Form.Label>Inspection Period End</Form.Label>
                <Datetime
                  timeFormat={true}
                  onChange={(e: any) => {
                    // console.log("e", e.unix());

                    setValue("inspectPeriodEnd", e.toString());
                  }}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("inspectPeriodEnd", {
                          required: true,
                        })}
                        type="text"
                        value={getValues("inspectPeriodEnd")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                        }}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="inspect-period-end">
                <Form.Label>Inspection Period Extension</Form.Label>
                <Datetime
                  timeFormat={true}
                  onChange={(e: any) => {
                    // console.log("e", e.unix());

                    setValue("inspectPeriodExtension", e.toString());
                  }}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("inspectPeriodExtension", {
                          required: true,
                        })}
                        type="text"
                        value={getValues("inspectPeriodExtension")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                        }}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="closing-date">
                <Form.Label>Moving Date</Form.Label>
                <Datetime
                  timeFormat={true}
                  onChange={(e: any) => {
                    // console.log("e", e.unix());

                    setValue("movingDate", e.toString());
                  }}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("movingDate", {
                          required: true,
                        })}
                        type="text"
                        value={getValues("movingDate")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                        }}
                        onChange={() => {}}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="closing-date">
                <Form.Label>Closing Date</Form.Label>
                <Datetime
                  timeFormat={true}
                  onChange={(e: any) => {
                    // console.log("e", e.unix());

                    setValue("closingDate", e.toString());
                  }}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("closingDate", {
                          required: true,
                        })}
                        type="text"
                        value={getValues("closingDate")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                        }}
                        onChange={() => {}}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="closing-date">
                <Form.Label>Free Funds Date (without Arbitration)</Form.Label>
                <Datetime
                  timeFormat={true}
                  onChange={(e: any) => {
                    // console.log("e", e.unix());

                    setValue("freeFundsDate", e.toString());
                  }}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("freeFundsDate", {
                          required: true,
                        })}
                        type="text"
                        value={getValues("freeFundsDate")}
                        placeholder="mm/dd/yyyy"
                        onFocus={(e: any) => {
                          openCalendar();
                        }}
                        onChange={() => {}}
                      />
                    </InputGroup>
                  )}
                />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="my-4">Roles</h5>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="buyer">
                <Form.Label>Buyer</Form.Label>
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
              <Form.Group id="seller">
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

          {/* <h5 className="my-4">Property</h5>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="buyer">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  {...register("propertyAddress", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Address of the property"
                />
              </Form.Group>
            </Col>
            <Col sm={12} className="mb-3">
              <Form.Group id="buyer">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  {...register("propertyName", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Id/Name of the property"
                />
              </Form.Group>
            </Col>
          </Row> */}

          {/* <h5 className="my-4">Customization</h5>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="enableTimeChecks">
                <Form.Label>Enable Time Checks</Form.Label>
                <Form.Check {...register("enableTimeChecks", {})} />
              </Form.Group>
            </Col>
          </Row> */}

          <div className="mt-3">
            <Button variant="primary" type="submit">
              Create Contract
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
