import React, { ChangeEventHandler, useEffect, useState } from "react";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Card, Form, Button, InputGroup } from "react-bootstrap";

import { useForm } from "react-hook-form";

import { RootState } from "../../store/store";
import {
  fetchAlgoSignerNetworkAccounts,
  updateState,
} from "../../store/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface P {
  accounts: string[];
}

export const SettingsForm = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      selectedNetwork: settings.selectedNetwork,
      selectedAccount: settings.selectedAccount,
    },
  });

  useEffect(() => {
    // setValue("selectedAccount", settings.selectedAccount);

    console.log("___");

    const accountIndex = settings.accounts.findIndex(
      (item) => item.address === settings.selectedAccount
    );

    console.log("accountIndex", accountIndex);

    const selectedAccount =
      accountIndex > -1 ? settings.accounts[accountIndex] : "";

    console.log("selectedAccount", selectedAccount);

    setValue("selectedAccount", selectedAccount.address);
    // setValue("selectedNetwork", settings.selectedNetwork);
  }, [settings.accounts]);

  const onSubmit = (data: any) => {
    dispatch(updateState(data));
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Settings</h5>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="network">
                <Form.Label>
                  Network{" "}
                  {errors.selectedNetwork && (
                    <span style={{ color: "red" }}>*required</span>
                  )}
                </Form.Label>
                <Form.Select
                  {...register("selectedNetwork", { required: true })}
                  onChange={(e: React.FormEvent<EventTarget>) => {
                    let target = e.target as HTMLSelectElement;

                    console.log("!@#!@#", target.value);

                    dispatch(fetchAlgoSignerNetworkAccounts(target.value));
                  }}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {settings.supportedNetworks.map((i: any, idx: number) => {
                    return (
                      <option
                        key={i}
                        style={{
                          textOverflow: "ellipsis",
                        }}
                        value={i}
                      >
                        {i}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="gender">
                <Form.Label>
                  Account{" "}
                  {errors.selectedAccount && (
                    <span style={{ color: "red" }}>*required</span>
                  )}
                </Form.Label>
                <Form.Select
                  {...register("selectedAccount", { required: true })}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                >
                  <option
                    key={"Select"}
                    style={{
                      textOverflow: "ellipsis",
                    }}
                    value={""}
                  >
                    Select...
                  </option>
                  {props.accounts.map((i: any, idx: number) => {
                    return (
                      <option
                        key={i.address}
                        style={{
                          textOverflow: "ellipsis",
                        }}
                        value={i.address}
                      >
                        {i.address}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" type="submit">
              Save
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
