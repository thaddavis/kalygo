import React, { useEffect, useState } from "react";
import { Col, Row, Card, Form, Button, InputGroup } from "react-bootstrap";

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
import { clear_state_program } from "../../ABI/contracts/clear_state_program";
import { approval_program } from "../../ABI/contracts/approval_program";
import { compileProgram } from "../../ABI/utility/compileProgram";

interface P {
  accounts: string[];
}

export const NewContractForm = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      escrowAmount1: 500000,
      escrowAmount2: 600000,
      escrowTotal: 1100000,
      inspectionPeriodStart: moment().toString(),
      inspectionPeriodEnd: moment().add("2", "m").toString(),
      closingDate: moment().add("4", "m").toString(),
      buyer: "RHKHUONCBB7JOIQ2RDCSV3NUX5JFKLLOG2RKN4LRIJ6DQMAIBTFLLO72DM",
      seller: "QHGMAMCTEHZ2RQV2DRXSPAKIIT3REVK46CHNDJSW6WNXJLSJ7BB76NHDGY",
      arbiter: "T4N73AL4F4ZL6VJZWJ2QP2KV5VJEHJYFTFMVNTWG45MP4S4EDPJIWC45WI",
      propertyAddress: "3717 Royal Palm Ave.",
      propertyName: "Yellow House On Mid Miami Beach",
    },
  });

  const onSubmit = async (data: any) => {
    console.log("data", data);

    let params = await Algod.getAlgod().getTransactionParams().do();

    params.flatFee = true;
    params.fee = 1000;

    let onComplete = algosdk.OnApplicationComplete.NoOpOC;

    let a_prog = await compileProgram(Algod.getAlgod(), approval_program);
    let c_prog = await compileProgram(Algod.getAlgod(), clear_state_program);

    console.log("a_prog", a_prog);
    console.log("c_prog", c_prog);

    const appCreateTxn = algosdk.makeApplicationCreateTxn(
      settings.selectedAccount,
      params,
      onComplete,
      a_prog,
      c_prog,
      0,
      0,
      12,
      5,
      [
        algosdk.encodeUint64(moment(data.inspectionPeriodStart).unix()), // IP begin
        algosdk.encodeUint64(moment(data.inspectionPeriodEnd).unix()), // IP end
        algosdk.encodeUint64(moment(data.inspectionPeriodEnd).unix()), // IP extension
        algosdk.encodeUint64(moment(data.closingDate).unix()), //
        algosdk.encodeUint64(moment(data.closingDate).unix()), //
        algosdk.encodeUint64(1100000), // # sale_price
        algosdk.encodeUint64(500000), // # 1st_escrow_amount
        algosdk.encodeUint64(600000), // # 2nd_escrow_amount
        new Uint8Array(
          Buffer.from(algosdk.decodeAddress(data.buyer).publicKey)
        ), // # buyer
        new Uint8Array(
          Buffer.from(algosdk.decodeAddress(data.seller).publicKey)
        ), // # seller
        new Uint8Array(
          Buffer.from(algosdk.decodeAddress(data.arbiter).publicKey)
        ), // # arbiter
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

    try {
      console.log("1", signedTxn);

      let tmp = signedTxn.map((tx: any) => {
        if (tx)
          return {
            txID: tx.txID,
            blob: (window as any).AlgoSigner.encoding.base64ToMsgpack(tx.blob),
          };
        return {};
      });

      console.log("tmp", tmp);

      const res = await Algod.getAlgod().sendRawTransaction(tmp[0].blob).do();

      // let res = await (window as any).AlgoSigner.send({
      //   ledger: settings.selectedNetwork,
      //   tx: signedTxn.blob,
      // });

      console.log("2");

      console.log("res", res);

      const waiting = await algosdk.waitForConfirmation(
        Algod.getAlgod(),
        res.txId,
        32
      );

      console.log("waiting", waiting);
    } catch (e) {
      debugger;

      console.error(e);
    }

    // Algod.getAlgod().compile()
    // dispatch(updateState(data));
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <h5 className="mb-4">Contract Details</h5>
          <Row>
            <Col sm={4} className="mb-3">
              <Form.Group id="escrow-amount-1">
                <Form.Label>Escrow Amount 1 (mAlgos)</Form.Label>
                <Form.Control
                  {...register("escrowAmount1", { required: true })}
                  type="number"
                  placeholder="Amount 1"
                />
              </Form.Group>
            </Col>
            <Col sm={4} className="mb-3">
              <Form.Group id="escrow-amount-2">
                <Form.Label>Escrow Amount 2 (mAlgos)</Form.Label>
                <Form.Control
                  {...register("escrowAmount2", { required: true })}
                  type="number"
                  placeholder="Amount 2"
                />
              </Form.Group>
            </Col>
            <Col sm={4} className="mb-3">
              <Form.Group id="escrow-total">
                <Form.Label>Total (mAlgos)</Form.Label>
                <Form.Control
                  {...register("escrowTotal", { required: true })}
                  type="number"
                  placeholder="Total"
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

          <h5 className="my-4">Property</h5>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="propertyAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  {...register("propertyAddress", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Enter Property Address"
                />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group id="propertyName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  {...register("propertyName", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Enter Property Name"
                />
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
