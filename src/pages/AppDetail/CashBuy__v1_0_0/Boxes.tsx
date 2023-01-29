import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row, Card, ListGroup, Button } from "react-bootstrap";
import { RootState } from "../../../store/store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Algod } from "../../../services/algod";
import get from "lodash/get";

const BoxKey = ({ boxName }: { boxName: string }) => {
  return (
    <ListGroup.Item className="px-0">
      <Row className="align-items-center">
        <Col className="col-auto">
          <h5 className="h5 mb-0">{boxName}</h5>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export function Boxes() {
  let { id } = useParams();

  const settings = useAppSelector((state: RootState) => state.settings);

  const [boxes, setBoxes] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  useEffect(() => {
    async function fetch() {
      try {
        let boxInfo = await Algod.getAlgod(settings.selectedNetwork)
          .getApplicationBoxes(Number.parseInt(id!))
          .do();

        console.log("boxInfo", boxInfo);

        setBoxes({
          val: boxInfo,
          loading: false,
          error: null,
        });
        // console.log("boxInfo", boxInfo);
      } catch (e) {
        setBoxes({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    fetch();
  }, []);

  let arrayOfBoxes = get(boxes, "val.boxes", []);

  return (
    <>
      <h1>Boxes</h1>
      <ListGroup className="list-group-flush list my--3">
        {arrayOfBoxes.map((val: any, idx: number) => {
          return (
            <BoxKey
              boxName={get(val, "attribute_map.name", "Not Found")}
              key={get(val, "attribute_map.name", "Not Found")}
            />
          );
        })}
      </ListGroup>
    </>
  );
}
