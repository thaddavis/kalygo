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
import algosdk from "algosdk";
import { clear_state_program } from "../../ABI/contracts/cashBuy/clear_state_program";
import { approval_program } from "../../ABI/contracts/cashBuy/approval_program";
import { compileProgram } from "../../ABI/utility/compileProgram";
import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";

interface P {
  accounts: string[];
}

export const NewCashBuyContractForm = (props: P) => {
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
      escrowAmount1: 100000.2,
      escrowAmount2: 100000.0,
      escrowTotal: 200000.0,
      asaAddress: "USDCa",
      inspectionPeriodStart: moment().add("1", "m").add("30", "s").toString(),
      inspectionPeriodEnd: moment().add("3", "m").toString(),
      movingDate: moment().add("4", "m").toString(),
      closingDate: moment().add("5", "m").toString(),
      buyer: "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU",
      seller: "CMC7AD2G4MXIN46LBMP6WOO5O4SA3RVBWYNMPIHPMUDYKNYE4XS2Y3BOIM",
      arbiter: "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU",
      buyerRealtorAddress:
        "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU",
      buyerRealtorCommission: 3,
      sellerRealtorAddress:
        "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU",
      sellerRealtorCommission: 3,
      titleCompanyAddress:
        "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU",
      titleCompanyMinCommission: 3,
      titleCompanyMaxCommission: 6,
      jurisdictionAddress:
        "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU",
      jurisdictionMinFee: 3,
      jurisdictionMaxFee: 6,
      lenderAddress:
        "STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU",
      // propertyAddress: "3717 Royal Palm Ave.",
      // propertyName: "Yellow House On Mid Miami Beach",
      enableTimeChecks: true,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);

      let params = await Algod.getAlgod(settings.selectedNetwork)
        .getTransactionParams()
        .do();

      params.flatFee = true;
      params.fee = 1000;

      let onComplete = algosdk.OnApplicationComplete.NoOpOC;

      let a_prog = await compileProgram(
        Algod.getAlgod(settings.selectedNetwork),
        approval_program
      );
      let c_prog = await compileProgram(
        Algod.getAlgod(settings.selectedNetwork),
        clear_state_program
      );

      console.log("a_prog", a_prog);
      console.log("c_prog", c_prog);

      const appCreateTxn = algosdk.makeApplicationCreateTxn(
        settings.selectedAccount,
        params,
        onComplete,
        a_prog,
        c_prog,
        0, // local ints
        0, // local byte_slices
        10, // global ints
        3, // global byte_slices
        [
          // --- --- ---
          // 0 buyer
          // 1 seller
          // 2 1st_escrow_payment
          // 3 2nd_escrow_payment
          // 4 total escrow
          // 5 GLOBAL_INSPECTION_START_DATE
          // 6 GLOBAL_INSPECTION_END_DATE
          // 7 GLOBAL_MOVING_DATE
          // 8 GLOBAL_CLOSING_DATE
          // 9 GLOBAL_FREE_FUNDS_DATE
          // 10 GLOBAL_TIME_CHECK_ENABLED
          // --- --- ---
          // /* 0 */ algosdk.encodeUint64(
          //   moment(data.inspectionPeriodStart).unix()
          // ), // IP begin
          // /* 1 */ algosdk.encodeUint64(moment(data.inspectionPeriodEnd).unix()), // IP end
          // // /* */ algosdk.encodeUint64(moment(data.inspectionPeriodEnd).unix()), // IP extension
          // /* 2 */ algosdk.encodeUint64(moment(data.closingDate).unix()), //
          // // /* */ algosdk.encodeUint64(moment(data.closingDate).unix()), //
          // /*  3 */ algosdk.encodeUint64(1100000), // # sale_price
          // /* 4 */ algosdk.encodeUint64(500000), // # 1st_escrow_amount
          // /* 5 */ algosdk.encodeUint64(600000), // # 2nd_escrow_amount
          // /* 6 */ new Uint8Array(
          //   Buffer.from(algosdk.decodeAddress(data.buyer).publicKey)
          // ), // # buyer
          // /* 7 */ new Uint8Array(
          //   Buffer.from(algosdk.decodeAddress(data.seller).publicKey)
          // ), // # seller
          // /* 8 */ new Uint8Array(
          //   Buffer.from(algosdk.decodeAddress(data.arbiter).publicKey)
          // ), // # arbiter
          // algosdk.encodeUint64(data.enableTimeChecks ? 1 : 0), // # int - enable_time_checks
          // --- --- --- --- ---
        ]
      );

      let binaryTx = appCreateTxn.toByte();

      let base64Tx = (window as any).AlgoSigner.encoding.msgpackToBase64(
        binaryTx
      );

      console.log(base64Tx);

      let signedTxn = await (window as any).AlgoSigner.signTxn([
        {
          txn: base64Tx,
        },
      ]);

      console.log("signedTxn", signedTxn);

      let tmp = signedTxn.map((tx: any) => {
        if (tx)
          return {
            txID: tx.txID,
            blob: (window as any).AlgoSigner.encoding.base64ToMsgpack(tx.blob),
          };
        return {};
      });

      const res = await Algod.getAlgod(settings.selectedNetwork)
        .sendRawTransaction(tmp[0].blob)
        .do();

      console.log("res", res);

      showSuccessToast("Contract creation request sent to network!");

      showSuccessToast("Awaiting block confirmation...");

      const waiting = await algosdk.waitForConfirmation(
        Algod.getAlgod(settings.selectedNetwork),
        res.txId,
        32
      );

      console.log(waiting);

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
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                  step="0.01"
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
                <Form.Label>ASA (ie: USDCa)</Form.Label>
                <Form.Control
                  {...register("asaAddress", {
                    required: true,
                  })}
                  type="text"
                  placeholder="ASA Address"
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
            <Col sm={12} className="mb-3">
              <Form.Group id="arbiter">
                <Form.Label>Arbiter</Form.Label>
                <Form.Control
                  {...register("arbiter", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Arbiter Wallet Address"
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
