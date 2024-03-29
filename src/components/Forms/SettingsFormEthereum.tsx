import React, { useEffect } from "react";
import { Col, Row, Card, Form, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form";

import { RootState } from "../../store/store";
import {
  fetchAlgoSignerNetworkAccounts,
  fetchMetamaskNetworkAccounts,
  updateState,
} from "../../store/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Algod } from "../../services/algod";

interface P {
  // accounts: string[];
}

export const SettingsFormEthereum = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      selectedBlockchain: settings.selectedBlockchain,
      selectedEthereumNetwork: settings.selectedEthereumNetwork,
      selectedAlgorandAccount: settings.selectedAlgorandAccount,
      selectedEthereumAccount: settings.selectedEthereumAccount,
    },
  });

  watch("selectedEthereumNetwork");

  useEffect(() => {
    const accountIndex = settings.accountsEthereum.findIndex(
      (item: any) => item.address === settings.selectedEthereumAccount
    );

    const selectedAccount =
      accountIndex > -1 ? settings.accountsEthereum[accountIndex] : "";

    setValue("selectedEthereumAccount", selectedAccount.address);
  }, [settings.accountsEthereum]);

  const onSubmit = (data: any) => {
    dispatch(updateState(data));

    Algod.setAlgod(data.selectedNetwork);
    Algod.setIndexer(data.selectedNetwork);
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Settings</h5>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="blockchain">
                <Form.Label>
                  Blockchain{" "}
                  {errors.selectedBlockchain && (
                    <span style={{ color: "red" }}>*required</span>
                  )}
                </Form.Label>
                <Form.Select
                  {...register("selectedBlockchain", { required: true })}
                  onChange={(e: React.FormEvent<EventTarget>) => {
                    let target = e.target as HTMLSelectElement;

                    console.log("!@#!@#", target.value);
                    console.warn(
                      "Need to populate network select with relevant networks for chosen blockchain"
                    );

                    setValue("selectedAlgorandAccount", "");
                    setValue("selectedEthereumAccount", "");
                    setValue("selectedEthereumNetwork", "");
                    setValue("selectedBlockchain", target.value);

                    // dispatch(
                    //   updateState({
                    //     selectedBlockchain: target.value,
                    //     selectedNetwork: "",
                    //   })
                    // );

                    // switch (settings.selectedBlockchain) {
                    switch (target.value) {
                      case "Algorand":
                        dispatch(fetchAlgoSignerNetworkAccounts(target.value));
                        break;
                      case "Ethereum":
                        dispatch(fetchMetamaskNetworkAccounts(target.value));
                        break;
                    }
                  }}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {settings.supportedBlockchains.map((i: any, idx: number) => {
                    return (
                      <option
                        key={i}
                        disabled={
                          ["Algorand", "Ethereum"].includes(i) ? false : true
                        }
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
          </Row>

          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="network">
                <Form.Label>
                  Network{" "}
                  {errors.selectedEthereumNetwork && (
                    <span style={{ color: "red" }}>*required</span>
                  )}
                </Form.Label>
                <Form.Select
                  {...register("selectedEthereumNetwork", { required: true })}
                  onChange={(e: React.FormEvent<EventTarget>) => {
                    let target = e.target as HTMLSelectElement;

                    console.log("!@#!@#", target.value);

                    setValue("selectedAlgorandAccount", "");
                    setValue("selectedEthereumAccount", "");
                    setValue("selectedEthereumNetwork", target.value);

                    // switch (target.value) {
                    switch (settings.selectedBlockchain) {
                      case "Algorand":
                        dispatch(fetchAlgoSignerNetworkAccounts(target.value));
                        break;
                      case "Ethereum":
                        dispatch(fetchMetamaskNetworkAccounts(target.value));
                        break;
                    }
                  }}
                  style={{
                    paddingRight: "32px",
                    textOverflow: "ellipsis",
                  }}
                >
                  {settings.selectedBlockchain === "Algorand" &&
                    settings.supportedAlgorandNetworks.map(
                      (i: any, idx: number) => {
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
                      }
                    )}

                  {settings.selectedBlockchain === "Ethereum" &&
                    settings.supportedEthereumNetworks.map(
                      (i: any, idx: number) => {
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
                      }
                    )}
                </Form.Select>
              </Form.Group>
            </Col>
            {/* <Col md={6} className="mb-3">
              <Form.Group id="gender">
                <Form.Label>
                  Account{" "}
                  {errors.selectedAlgorandAccount && (
                    <span style={{ color: "red" }}>*required</span>
                  )}
                  {errors.selectedEthereumAccount && (
                    <span style={{ color: "red" }}>*required</span>
                  )}
                  <FontAwesomeIcon
                    color="black"
                    icon={faRotate}
                    onClick={() => {
                      switch (settings.selectedBlockchain) {
                        case "Ethereum":
                          console.log("_+_ Ethereum _+_");
                          dispatch(
                            fetchMetamaskNetworkAccounts(
                              getValues("selectedNetwork")
                            )
                          );
                          break;
                        case "Algorand":
                          console.log("_+_ Algorand _+_");
                          dispatch(
                            fetchAlgoSignerNetworkAccounts(
                              getValues("selectedNetwork")
                            )
                          );
                          break;
                      }

                      console.log("___ ___ ___");
                    }}
                  />
                </Form.Label>
                <Form.Select
                  {...register("selectedAlgorandAccount", { required: true })}
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
                  {settings.selectedBlockchain === "Algorand" &&
                    settings.accounts.map((i: any, idx: number) => {
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
                  {settings.selectedBlockchain === "Ethereum" &&
                    settings.accounts.map((i: any, idx: number) => {
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
            </Col> */}
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
