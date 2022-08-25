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
import { clear_state_program } from "../../ABI/contracts/clear_state_program";
import { approval_program } from "../../ABI/contracts/approval_program";
import { compileProgram } from "../../ABI/utility/compileProgram";
import { showErrorToast } from "../../utility/errorToast";
import { showSuccessToast } from "../../utility/successToast";

interface P {
  accounts: string[];
}

export const NewPropertyNFTForm = (props: P) => {
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
      assetName: "Albanian Villa",
      equityDivisions: 100000,
      enableClawback: true,
      unitName: "ALB",
      url: "https://albanianvillas.com",
    },
  });

  watch("equityDivisions");

  async function createAsset(
    algodClient: any,
    account: {
      sk: Uint8Array;
      addr: string;
    }
  ) {
    const feePerByte = 10;
    const firstValidRound = 22289903;
    const lastValidRound = 22290903;
    const genesisHash = "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=";

    const total = 1000000000000000; // how many of this asset there will be
    const decimals = 6; // units of this asset are whole-integer amounts
    const assetName = "Mialgo";
    const unitName = "MIALGO";
    const url = "mialgo.io";

    const defaultFrozen = false; // whether accounts should be frozen by default

    const suggestedParams = {
      flatFee: false,
      fee: feePerByte,
      firstRound: firstValidRound,
      lastRound: lastValidRound,
      genesisHash,
      genesisID: "testnet-v1.0",
    };

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

      suggestedParams,
    });

    // sign the transaction
    const signedTxn = txn.signTxn(account.sk);

    let sendTx = await algodClient.sendRawTransaction(signedTxn).do();

    let assetID = null;
    // wait for transaction to be confirmed
    const ptx = await algosdk.waitForConfirmation(algodClient, sendTx.txId, 4);
    // Get the new asset's information from the creator account
    assetID = ptx["asset-index"];
    //Get the completed Transaction
    console.log(
      "Transaction " +
        sendTx.txId +
        " confirmed in round " +
        ptx["confirmed-round"]
    );

    return {
      assetID,
    };
  }

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);

      let params = await Algod.getAlgod(settings.selectedNetwork)
        .getTransactionParams()
        .do();

      params.flatFee = true;
      params.fee = 1000;

      const account = {
        addr: `STRA24PIDCBJIWPSH7QEBM4WWUQU36WVGCEPAKOLZ6YK7IVLWPGL6AN6RU`,
        sk: "secretKey.sk",
      };

      const total = data.equityDivisions; // how many of this asset there will be
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
                <Form.Label>Name of Property</Form.Label>
                <Form.Control
                  {...register("assetName", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Name of Property"
                />
              </Form.Group>
            </Col>

            <Col sm={12} className="mb-3">
              <Form.Group id="equity-divisions">
                <Form.Label>Equity Divisions</Form.Label>
                <Form.Control
                  {...register("equityDivisions", { required: true })}
                  type="number"
                  placeholder="Equity Divisions"
                />

                <p>
                  One unit of this NFT would represent a{" "}
                  {100 / getValues("equityDivisions")}% stake
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
