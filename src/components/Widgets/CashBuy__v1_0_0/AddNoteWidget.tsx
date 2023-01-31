import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { Col, Row, Button, Dropdown, Modal, Form } from "react-bootstrap";

import algosdk, {
  AtomicTransactionComposer,
  ABIArgument,
  Account,
  Transaction,
} from "algosdk";

import ABI from "../../../contractExports/contracts/cashBuy/application.json";

import { RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Algod } from "../../../services/algod";
import { Buffer } from "buffer";
import { showErrorToast } from "../../../utility/errorToast";
import { showSuccessToast } from "../../../utility/successToast";

import { supportedContracts } from "../../../data/supportedContracts";
import { signer } from "../../../contractActions/helpers/signers/AlgoSigner";
import { formatNumberFromString } from "../../../components/Forms/helpers/formatCurrency";
import { values } from "lodash";

interface P {
  showNoteModal: boolean;
  closeNoteModal: () => void;
  appId: number;
  contractAddress: string;
  operator: string;
  title: string;
  value: string;
}

export function AddNoteWidget({
  showNoteModal,
  closeNoteModal,
  appId,
  operator,
  contractAddress,
  title,
  value,
}: P) {
  const settings = useAppSelector((state: RootState) => state.settings);

  const [formState, setFormState] = useState({
    loading: false,
    error: null,
  });

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
      note: value,
    },
  });

  useEffect(() => {
    console.log("___ _*_*_ ___", value);

    setValue("note", value);
  }, [value]);

  const onSubmit = async (data: { note: string }) => {
    try {
      // setFormState({
      //   loading: true,
      //   error: false,
      // });

      console.log("-> data <-", data);
      const { note } = data;

      console.log(note);
      console.log(note.padStart(64, " "));

      // let byteCount = getValues("title").length + getValues("note").length;
      // let mbr = 2500 + 400 * byteCount || -1;

      const contract = new algosdk.ABIContract(ABI.contract);
      let atc = new AtomicTransactionComposer();
      let params = await Algod.getAlgod(settings.selectedNetwork)
        .getTransactionParams()
        .do();

      // const ptxn = new Transaction({
      //   from: operator,
      //   to: contractAddress,
      //   amount: mbr,
      //   note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
      //   ...params,
      // });
      // const tws = {
      //   txn: ptxn,
      //   signer: signer,
      // };

      // atc.addTransaction(tws);

      atc.addMethodCall({
        appID: appId,
        method: contract.getMethodByName("add_key_to_buyer_note_box"),
        methodArgs: [note.padEnd(64, " ")] as ABIArgument[],
        sender: operator,
        suggestedParams: params,
        note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
        signer: signer,
        boxes: [
          {
            appIndex: appId,
            // name: new Uint8Array(Buffer.from(title, "utf8")),
            name: new Uint8Array(Buffer.from("Buyer", "utf8")),
          },
        ],
      });

      const tx_id = await atc.submit(Algod.getAlgod(settings.selectedNetwork));

      console.log("submit_response", tx_id);

      showSuccessToast("Awaiting block confirmation...");
      await algosdk.waitForConfirmation(
        Algod.getAlgod(settings.selectedNetwork),
        tx_id[0],
        32
      );

      closeNoteModal();
    } catch (e) {
      showErrorToast("Something unexpected happened.");
      console.error(e);
    }
  };

  console.log("value", value);
  // console.log("isLoading", isLoading);
  //   console.log("errors", errors);
  //   console.log("isValid", isValid);

  // let byteCount = getValues("title").length + getValues("note").length;
  // let mbr = formatNumberFromString((2500 + 400 * byteCount).toString()) || "";
  // let mbr = formatNumberFromString((400 * byteCount).toString()) || "";

  return (
    <>
      <Modal show={showNoteModal} onHide={closeNoteModal}>
        <Form onSubmit={handleSubmit(onSubmit)} id="add-note-contract-form">
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              {/* <Col sm={12} className="mb-3">
                <Form.Group id="escrow-amount-1">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    {...register("title", {
                      required: true,
                    })}
                    placeholder="Title"
                  />
                </Form.Group>
              </Col> */}

              <Col sm={12} className="mb-3">
                <Form.Group id="escrow-amount-1">
                  <Form.Label>Note</Form.Label>
                  <Form.Control
                    {...register("note", {
                      required: true,
                      min: 0,
                      max: 64,
                    })}
                    as="textarea"
                    rows={3}
                    maxLength={64}
                    placeholder="Note"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={12} className="mb-3">
                {/* Byte Count: {byteCount} */}
                <br />
                {/* Cost: {mbr} mAlgos
                <br /> */}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeNoteModal}>
              Close
            </Button>
            {/* <Button variant="primary" type="submit" disabled={isLoading}> */}
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
