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
      name: "Albanian Villa",
      equityDivisions: 100000,
      enableClawback: true,
    },
  });

  watch("equityDivisions");

  const onSubmit = async (data: any) => {
    try {
      console.log("-> data <-", data);

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

      // showSuccessToast("Contract creation request sent to network!");

      showErrorToast("Create ASA...");
    } catch (e) {
      showErrorToast("Something unexpected happened");
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
              <Form.Group id="name">
                <Form.Label>Name of Property</Form.Label>
                <Form.Control
                  {...register("name", {
                    required: true,
                  })}
                  type="text"
                  placeholder="Name of Property"
                />
              </Form.Group>
            </Col>

            <Col sm={12} className="mb-3">
              <Form.Group id="escrow-amount-1">
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
