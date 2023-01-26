import React, { useEffect, useState } from "react";
import { Col, Row, Card, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import moment from "moment-timezone";
import { Buffer } from "buffer";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Algod } from "../../services/algod";
import { clear_state_program } from "../../ABI/contracts/cashBuy/clear_state_program";
import { approval_program } from "../../ABI/contracts/cashBuy/approval_program";
import { compileProgram } from "../../ABI/utility/compileProgram";
import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";
import { supportedContracts } from "../../data/supportedContracts";

import algosdk, {
  AtomicTransactionComposer,
  ABIArgument,
  Account,
} from "algosdk";

import ABI from "../../ABI/contracts/cashBuy/abi.json";

interface P {
  accounts: string[];
}

export const CashBuyContractForm = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      escrowAmount1: 100000,
      escrowAmount2: 100000,
      escrowTotal: 200000,
      // asaId: 95939489,
      asaId: 12,
      inspectionPeriodStart: moment().add("1", "m").add("0", "s").toString(),
      inspectionPeriodEnd: moment().add("2", "m").toString(),
      inspectionPeriodExtension: moment().add("3", "m").toString(),
      movingDate: moment().add("4", "m").toString(),
      closingDate: moment().add("5", "m").toString(),
      freeFundsDate: moment().add("6", "m").toString(),
      // inspectionPeriodStart: moment().add("30", "s").toString(),
      // inspectionPeriodEnd: moment().add("60", "s").toString(),
      // inspectionPeriodExtension: moment().add("90", "s").toString(),
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
        inspectionPeriodStart,
        inspectionPeriodEnd,
        inspectionPeriodExtension,
        movingDate,
        closingDate,
        freeFundsDate,
        enableTimeChecks,
        asaId,
      } = data;

      const contract = new algosdk.ABIContract(ABI);
      let atc = new AtomicTransactionComposer();
      let params = await Algod.getAlgod(settings.selectedNetwork)
        .getTransactionParams()
        .do();
      // params.flatFee = true;
      // params.fee = 1000;

      let onComplete = algosdk.OnApplicationComplete.NoOpOC;

      let a_prog = await compileProgram(
        Algod.getAlgod(settings.selectedNetwork),
        approval_program
      );
      let c_prog = await compileProgram(
        Algod.getAlgod(settings.selectedNetwork),
        clear_state_program
      );

      // async function signer(unsignedTxns: Array<algosdk.Transaction>) {
      //   // console.log("unsignedTxns", unsignedTxns);

      //   return (window as any).AlgoSigner.signTxns(
      //     unsignedTxns.map((txn) =>
      //       (window as any).AlgoSigner.encoding.msgpackToBase64(txn.toByte())
      //     )
      //   );
      //   // .map((sTxn: any) => Uint8Array.from(atob(sTxn), (v) => v.charCodeAt(0)));
      // }

      atc.addMethodCall({
        appID: 0,
        method: contract.getMethodByName("create"),
        methodArgs: [
          buyer, // global_buyer: "",
          seller, // global_seller: "",
          Math.floor(escrowAmount1), // global_escrow_payment_1: "",
          Math.floor(escrowAmount2), // global_escrow_payment_2: "",
          Math.floor(escrowTotal), // global_total_price: "",
          moment(inspectionPeriodStart).unix(), // global_inspection_start_date: "",
          moment(inspectionPeriodEnd).unix(), // global_inspection_end_date: "",
          moment(inspectionPeriodExtension).unix(), // global_inspection_extension_date: "",
          moment(movingDate).unix(), // global_moving_date: "",
          moment(closingDate).unix(), // global_closing_date: "",
          moment(freeFundsDate).unix(), // global_free_funds_date: "",
          Math.floor(asaId), // global_asa_id: ""
        ] as ABIArgument[],
        approvalProgram: a_prog,
        clearProgram: c_prog,
        numGlobalByteSlices: 3,
        numGlobalInts: 13,
        numLocalByteSlices: 0,
        numLocalInts: 0,
        sender: settings.selectedAccount,
        suggestedParams: params,
        note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
        signer: async (
          unsignedTxns: Array<algosdk.Transaction>
        ): Promise<Uint8Array[]> => {
          console.log("unsignedTxns", unsignedTxns);

          // let binaryTx = appCreateTxn.toByte();

          let signedTxns = await (window as any).AlgoSigner.signTxn(
            unsignedTxns.map((_txn) => {
              return {
                txn: (window as any).AlgoSigner.encoding.msgpackToBase64(
                  _txn.toByte()
                ),
              };
            })
          );

          return signedTxns.map((sTxn: any) => {
            console.log("sTxn", sTxn);
            return Uint8Array.from(Buffer.from(sTxn.blob, "base64"));
          });
        },
        onComplete: onComplete,
      });

      const tx_id = await atc.submit(Algod.getAlgod(settings.selectedNetwork));

      console.log("submit_response", tx_id);

      showSuccessToast("Contract creation request sent to network!");

      const waiting = await algosdk.waitForConfirmation(
        Algod.getAlgod(settings.selectedNetwork),
        tx_id[0],
        32
      );

      // const txn_id = await atc.execute(
      //   Algod.getAlgod(settings.selectedNetwork),
      //   2
      // );

      showSuccessToast("Awaiting block confirmation...");

      // let params = await Algod.getAlgod(settings.selectedNetwork)
      //   .getTransactionParams()
      //   .do();

      // params.flatFee = true;
      // params.fee = 1000;

      // let onComplete = algosdk.OnApplicationComplete.NoOpOC;

      // let a_prog = await compileProgram(
      //   Algod.getAlgod(settings.selectedNetwork),
      //   approval_program
      // );
      // let c_prog = await compileProgram(
      //   Algod.getAlgod(settings.selectedNetwork),
      //   clear_state_program
      // );

      // console.log("a_prog", a_prog);
      // console.log("c_prog", c_prog);

      // const appCreateTxn = algosdk.makeApplicationCreateTxn(
      //   settings.selectedAccount,
      //   params,
      //   onComplete,
      //   a_prog,
      //   c_prog,
      //   0, // local ints
      //   0, // local byte_slices
      //   13, // global ints
      //   3, // global byte_slices
      //   [
      //     new Uint8Array(Buffer.from("create")),
      //     // --- --- ---
      //     new Uint8Array(Buffer.from(algosdk.decodeAddress(buyer).publicKey)), // 0 buyer
      //     new Uint8Array(Buffer.from(algosdk.decodeAddress(seller).publicKey)), // 1 seller
      //     algosdk.encodeUint64(Math.floor(escrowAmount1)), // 2 1st_escrow_payment
      //     algosdk.encodeUint64(Math.floor(escrowAmount2)), // 3 2nd_escrow_payment
      //     algosdk.encodeUint64(Math.floor(escrowTotal)), // 4 total escrow
      //     algosdk.encodeUint64(moment(inspectionPeriodStart).unix()), // 5 GLOBAL_INSPECTION_START_DATE
      //     algosdk.encodeUint64(moment(inspectionPeriodEnd).unix()), // 6 GLOBAL_INSPECTION_END_DATE
      //     algosdk.encodeUint64(moment(inspectionPeriodExtension).unix()), // 7 GLOBAL_INSPECTION_EXTENSION_DATE
      //     algosdk.encodeUint64(moment(movingDate).unix()), // 8 GLOBAL_MOVING_DATE
      //     algosdk.encodeUint64(moment(closingDate).unix()), // 9 GLOBAL_CLOSING_DATE
      //     algosdk.encodeUint64(moment(freeFundsDate).unix()), // 10 GLOBAL_FREE_FUNDS_DATE
      //     // algosdk.encodeUint64(enableTimeChecks ? 1 : 0), // 11 GLOBAL_TIME_CHECK_ENABLED
      //     algosdk.encodeUint64(Math.floor(asaId)), // 12 GLOBAL_ASA_ID
      //     // --- --- --- --- ---
      //   ],
      //   [],
      //   [],
      //   [],
      //   new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0))
      // );

      // let binaryTx = appCreateTxn.toByte();

      // let base64Tx = (window as any).AlgoSigner.encoding.msgpackToBase64(
      //   binaryTx
      // );

      // console.log(base64Tx);

      // let signedTxn = await (window as any).AlgoSigner.signTxn([
      //   {
      //     txn: base64Tx,
      //   },
      // ]);

      // console.log("signedTxn", signedTxn);

      // let tmp = signedTxn.map((tx: any) => {
      //   if (tx)
      //     return {
      //       txID: tx.txID,
      //       blob: (window as any).AlgoSigner.encoding.base64ToMsgpack(tx.blob),
      //     };
      //   return {};
      // });

      // const res = await Algod.getAlgod(settings.selectedNetwork)
      //   .sendRawTransaction(tmp[0].blob)
      //   .do();

      // console.log("res", res);

      navigate(`/dashboard/transactions`);
    } catch (e) {
      showErrorToast(
        "Something unexpected happened. Make sure your wallet is connected."
      );
      console.error(e);
    }
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)} id="cash-buy-contract-form">
          <h5 className="mb-4">Contract Details</h5>
          <Row>
            <Col sm={4} className="mb-3">
              <Form.Group id="escrow-amount-1">
                <Form.Label>
                  Escrow Amount 1<br />
                  <small>(ASA)</small>
                </Form.Label>
                <Form.Control
                  {...register("escrowAmount1", { required: true })}
                  type="number"
                  placeholder="Amount 1"
                />
              </Form.Group>
            </Col>
            <Col sm={4} className="mb-3">
              <Form.Group id="escrow-amount-2">
                <Form.Label>
                  Escrow Amount 2<br />
                  <small>(ASA)</small>
                </Form.Label>
                <Form.Control
                  {...register("escrowAmount2", { required: true })}
                  type="number"
                  placeholder="Amount 2"
                />
              </Form.Group>
            </Col>
            <Col sm={4} className="mb-3">
              <Form.Group id="escrow-total">
                <Form.Label>
                  Total Price
                  <br />
                  <small>(ASA)</small>
                </Form.Label>
                <Form.Control
                  {...register("escrowTotal", { required: true })}
                  type="number"
                  placeholder="Total"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col sm={12} className="mb-3">
              <Form.Group id="seller">
                <Form.Label>ASA id (ie: USDCa)</Form.Label>
                <Form.Control
                  {...register("asaId", {
                    required: true,
                  })}
                  type="number"
                  placeholder="ASA id"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="inspection-period-start">
                <Form.Label>Inpection Period Start</Form.Label>
                <Datetime
                  timeFormat={true}
                  onChange={(e: any) => {
                    // console.log("e", e.unix());

                    setValue("inspectionPeriodStart", e.toString());
                  }}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("inspectionPeriodStart", {
                          required: true,
                        })}
                        type="text"
                        value={getValues("inspectionPeriodStart")}
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
              <Form.Group id="inspection-period-end">
                <Form.Label>Inpection Period End</Form.Label>
                <Datetime
                  timeFormat={true}
                  onChange={(e: any) => {
                    // console.log("e", e.unix());

                    setValue("inspectionPeriodEnd", e.toString());
                  }}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("inspectionPeriodEnd", {
                          required: true,
                        })}
                        type="text"
                        value={getValues("inspectionPeriodEnd")}
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
              <Form.Group id="inspection-period-end">
                <Form.Label>Inpection Period Extension</Form.Label>
                <Datetime
                  timeFormat={true}
                  onChange={(e: any) => {
                    // console.log("e", e.unix());

                    setValue("inspectionPeriodExtension", e.toString());
                  }}
                  renderInput={(props, openCalendar) => (
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        {...register("inspectionPeriodExtension", {
                          required: true,
                        })}
                        type="text"
                        value={getValues("inspectionPeriodExtension")}
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

          <h5 className="my-4">Property</h5>
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
          </Row>

          <h5 className="my-4">Customization</h5>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="enableTimeChecks">
                <Form.Label>Enable Time Checks</Form.Label>
                <Form.Check {...register("enableTimeChecks", {})} />
              </Form.Group>
            </Col>
          </Row>

          <div className="mt-3">
            <Button variant="primary" type="submit">
              Create
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
