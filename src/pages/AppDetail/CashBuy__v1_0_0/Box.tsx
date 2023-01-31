import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Card, ListGroup, Button, Form } from "react-bootstrap";
import { RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Algod } from "../../../services/algod";
import { showErrorToast } from "../../../utility/errorToast";
import { showSuccessToast } from "../../../utility/successToast";
import ABI from "../../../contractExports/contracts/cashBuy/application.json";

import { useForm } from "react-hook-form";
import algosdk, { AtomicTransactionComposer, ABIArgument } from "algosdk";
import get from "lodash/get";
import { Buffer } from "buffer";
import { supportedContracts } from "../../../data/supportedContracts";
import { signer } from "../../../contractActions/helpers/signers/AlgoSigner";

const ListGroupItem = ({
  boxKey,
  value,
}: {
  boxKey: string;
  value: string;
}) => {
  return (
    <ListGroup.Item className="px-0">
      <Row className="align-items-center">
        <Col xs={12} className="col-auto">
          <h5 className="h5 mb-0">{boxKey}</h5>
          <br />
          {/* <h6 className="65 mb-0">{value}</h6> */}
          <Form.Control as="textarea" value={value} readOnly={true} rows={4} />
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

function arrayBufferToString(buffer: any) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return binary;
}

export function Box() {
  let { app_id, box } = useParams();

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
      note: "",
    },
  });

  const settings = useAppSelector((state: RootState) => state.settings);

  const [note, setNote] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  useEffect(() => {
    async function fetch() {
      try {
        // let boxInfo = await Algod.getAlgod(settings.selectedNetwork)
        //   .getApplicationBoxes(Number.parseInt(app_id!))
        //   .do();

        // let tmp = [];

        // for (let i = 0; i < boxInfo.boxes.length; i++) {
        //   let boxKey = arrayBufferToString(
        //     get(boxInfo.boxes[i], get(boxInfo.boxes[i], `attribute_map.name`))
        //   );

        //   console.log("___ ___ ___", boxKey);

        let boxValue = await Algod.getAlgod(settings.selectedNetwork)
          .getApplicationBoxByName(
            Number.parseInt(app_id!),
            new Uint8Array(Buffer.from(box || "", "utf8"))
          )
          .do();

        //   console.log("box", box);
        //   console.log("box.value", arrayBufferToString(box.value));

        // tmp.push({
        //   boxKey,
        //   boxValue: arrayBufferToString(box.value),
        // });
        // }

        // debugger;

        setValue("note", arrayBufferToString(boxValue.value).trimEnd());

        // setNote({
        //   val: arrayBufferToString(boxValue.value),
        //   loading: false,
        //   error: null,
        // });
      } catch (e) {
        console.log("e", e);
        setValue("note", "");

        // setNote({
        //   val: null,
        //   loading: false,
        //   error: e,
        // });
      }
    }

    fetch();
  }, []);

  const onSubmit = async (data: { note: string }) => {
    try {
      // setFormState({
      //   loading: true,
      //   error: false,
      // });

      console.log("-> data <-", data);
      const { note } = data;

      console.log(note);
      console.log(note.padStart(256, " "));

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
        appID: Number.parseInt(app_id!),
        method: contract.getMethodByName("add_key_to_buyer_note_box"),
        methodArgs: [note.padEnd(256, " ")] as ABIArgument[],
        sender: settings.selectedAccount,
        suggestedParams: params,
        note: new Uint8Array(Buffer.from(supportedContracts.cashBuy__v1_0_0)),
        signer: signer,
        boxes: [
          {
            appIndex: Number.parseInt(app_id!),
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

      // closeNoteModal();
    } catch (e) {
      showErrorToast("Something unexpected happened.");
      console.error(e);
    }
  };

  return (
    <>
      <Card border="light" className="shadow-sm mb-4 mt-4">
        <Card.Header className="border-bottom border-light d-flex justify-content-between">
          <h5 className="mb-0">Notes</h5>
        </Card.Header>
        <Form onSubmit={handleSubmit(onSubmit)} id="add-note-contract-form">
          <Card.Body>
            {/* <ListGroup className="list-group-flush list my--3">
              <ListGroupItem
                key={"Buyer"}
                boxKey={"Buyer"}
                value={get(note, "val", "Not Found")}
              />
            </ListGroup> */}
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
                <Form.Group id="note">
                  <Form.Control
                    {...register("note", {
                      required: true,
                      min: 0,
                      max: 256,
                    })}
                    as="textarea"
                    rows={4}
                    maxLength={256}
                    placeholder="Note"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            {/* <Button variant="primary" type="submit" disabled={isLoading}> */}
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </>
  );
}
