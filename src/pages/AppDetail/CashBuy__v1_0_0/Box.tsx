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
        let boxValue = await Algod.getAlgod(settings.selectedNetwork)
          .getApplicationBoxByName(
            Number.parseInt(app_id!),
            new Uint8Array(Buffer.from(box || "", "utf8"))
          )
          .do();

        setValue("note", arrayBufferToString(boxValue.value).trimEnd());
      } catch (e) {
        setValue("note", "");
      }
    }

    fetch();
  }, []);

  const onSubmit = async (data: { note: string }) => {
    try {
      const { note } = data;

      const contract = new algosdk.ABIContract(ABI.contract);
      let atc = new AtomicTransactionComposer();
      let params = await Algod.getAlgod(settings.selectedNetwork)
        .getTransactionParams()
        .do();

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
            name: new Uint8Array(Buffer.from(box!, "utf8")),
          },
        ],
      });

      const tx_id = await atc.submit(Algod.getAlgod(settings.selectedNetwork));

      showSuccessToast("Awaiting block confirmation...");
      await algosdk.waitForConfirmation(
        Algod.getAlgod(settings.selectedNetwork),
        tx_id[0],
        32
      );
    } catch (e) {
      showErrorToast("Something unexpected happened.");
      console.error(e);
    }
  };

  return (
    <>
      <Card border="light" className="shadow-sm mb-4 mt-4">
        <Card.Header className="border-bottom border-light d-flex justify-content-between">
          <h5 className="mb-0">{box} Notes</h5>
        </Card.Header>
        <Form onSubmit={handleSubmit(onSubmit)} id="add-note-contract-form">
          <Card.Body>
            <Row>
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
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </>
  );
}
