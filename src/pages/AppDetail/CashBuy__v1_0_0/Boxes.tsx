import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Card, ListGroup, Button, Form } from "react-bootstrap";
import { RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Algod } from "../../../services/algod";
import get from "lodash/get";
import { Buffer } from "buffer";

const Box = ({ boxKey, value }: { boxKey: string; value: string }) => {
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

export function Boxes() {
  let { app_id, box } = useParams();

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

        setNote({
          val: arrayBufferToString(boxValue.value),
          loading: false,
          error: null,
        });
      } catch (e) {
        console.log("e", e);

        setNote({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    fetch();
  }, []);

  let arrayOfNotes = get(note, "val", []);

  return (
    <>
      <Card border="light" className="shadow-sm mb-4 mt-4">
        <Card.Header className="border-bottom border-light d-flex justify-content-between">
          <h5 className="mb-0">Notes</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup className="list-group-flush list my--3">
            {/* {arrayOfNotes.map((val: any, idx: number) => { */}
            {/* return ( */}
            <Box
              key={"Buyer"}
              boxKey={"Buyer"}
              value={get(note, "val", "Not Found")}
            />
            {/* ); */}
            {/* })} */}
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
}
