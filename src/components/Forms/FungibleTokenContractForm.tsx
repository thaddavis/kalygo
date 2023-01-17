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
import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";

interface P {
  accounts: string[];
}

export const FungibleTokenContractForm = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      assetName: "Asset Name",
      totalSupply: 1,
      enableClawback: true,
      unitName: "ie: USDCa or USDT or whatever",
      url: "URL",
    },
  });

  watch("totalSupply");

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);

      let params = await Algod.getAlgod(settings.selectedNetwork)
        .getTransactionParams()
        .do();

      params.flatFee = true;
      params.fee = 1000;

      debugger;

      const account = {
        addr: settings.selectedAccount,
      };

      const total = data.totalSupply; // how many of this asset there will be
      const decimals = 0; // units of this asset are whole-integer amounts
      const assetName = data.assetName;
      const unitName = data.unitName;
      const url = data.url;

      const defaultFrozen = false; // whether accounts should be frozen by default

      const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: account.addr,
        total,
        decimals,
        assetName,
        unitName,
        assetURL: url,
        assetMetadataHash: "",
        defaultFrozen,

        freeze: account.addr,
        manager: account.addr,
        clawback: account.addr,
        reserve: account.addr,

        suggestedParams: params,
      });

      console.log(txn);

      let binaryTx = txn.toByte();

      let base64Tx = (window as any).AlgoSigner.encoding.msgpackToBase64(
        binaryTx
      );

      console.log("base64Tx", base64Tx);

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

      showSuccessToast("Create ASA...");
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
          <h5 className="my-4">Fields</h5>
          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="assetName">
                <Form.Label>Asset Name</Form.Label>
                <Form.Control
                  {...register("assetName", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Asset Name"
                />
              </Form.Group>
            </Col>

            <Col sm={12} className="mb-0">
              <Form.Group id="equity-divisions">
                <Form.Label>Total Supply</Form.Label>
                <Form.Control
                  {...register("totalSupply", { required: true })}
                  type="number"
                  placeholder="Total Supply"
                />

                <p>
                  One unit of this token would represent a{" "}
                  {100 / getValues("totalSupply")}% stake
                </p>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="unit-name">
                <Form.Label>Unit Name</Form.Label>
                <Form.Control
                  {...register("unitName", { required: true })}
                  type="string"
                  placeholder="Unit Name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={12} className="mb-3">
              <Form.Group id="url">
                <Form.Label>URL</Form.Label>
                <Form.Control
                  {...register("url", {
                    required: true,
                  })}
                  type="text"
                  placeholder="URL"
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
