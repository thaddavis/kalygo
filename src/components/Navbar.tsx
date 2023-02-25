import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  Nav,
  Navbar,
  Dropdown,
  Container,
  Button,
  NavbarBrand,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { PeraWalletConnect } from "@perawallet/connect";

import { RootState } from "../store/store";
import { useAppSelector } from "../store/hooks";
import { showErrorToast } from "../utility/errorToast";
import settingsSlice from "../store/settings/settingsSlice";

interface P {}

export const NavbarComponent = (props: P) => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const navigate = useNavigate();

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-end w-100">
          {/* <div className="d-flex align-items-center">
            <Form className="navbar-search">
              <Form.Group id="topbarSearch">
                <InputGroup className="input-group-merge search-bar">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faSearch} />
                  </InputGroup.Text>
                  <Form.Control type="text" placeholder="Search" />
                </InputGroup>
              </Form.Group>
            </Form>
          </div> */}
          <Nav className="align-items-center">
            {/* <Dropdown as={Nav.Item}> */}
            {/* <Dropdown.Toggle
                as={Button}
                variant="secondary"
                className="text-dark me-2"
              > */}
            <Nav.Item>
              <Button
                variant="secondary"
                className="text-dark me-2"
                onClick={() => {
                  switch (settings.selectedBlockchain) {
                    case "Algorand":
                      switch (settings.selectedAlgorandWallet) {
                        case "AlgoSigner":
                          if (
                            typeof (window as any).AlgoSigner !== "undefined"
                          ) {
                            (window as any).AlgoSigner.connect()
                              .then(() =>
                                (window as any).AlgoSigner.accounts({
                                  ledger: settings.selectedAlgorandNetwork,
                                })
                              )
                              .then((accountData: any) => {
                                console.log(accountData);
                              })
                              .catch((e: any) => {
                                console.error(e);
                              });
                          } else {
                            console.error("NO AlgoSigner");
                            showErrorToast(
                              "Make sure you have a compatible wallet installed on your browser"
                            );
                          }
                          break;
                        case "Pera":
                          // showErrorToast("Need to connect to Pera Wallet");
                          type AlgorandChainIDs =
                            | 416001
                            | 416002
                            | 416003
                            | 4160;

                          const peraWallet = new PeraWalletConnect({
                            // Default chainId is "4160"
                            chainId: 416001,
                          });

                          peraWallet
                            .connect()
                            .then((newAccounts) => {
                              // Setup the disconnect event listener
                              peraWallet.connector?.on("disconnect", () =>
                                peraWallet.disconnect()
                              );

                              // setAccountAddress(newAccounts[0]);

                              console.log("newAccounts", newAccounts);
                            })
                            .catch((error: any) => {
                              // You MUST handle the reject because once the user closes the modal, peraWallet.connect() promise will be rejected.
                              // For the async/await syntax you MUST use try/catch
                              if (
                                error?.data?.type !== "CONNECT_MODAL_CLOSED"
                              ) {
                                // log the necessary errors
                              }
                            });

                          break;
                      }
                      break;
                    case "Ethereum":
                      if (typeof (window as any).ethereum !== "undefined") {
                        console.log("**-->> ETHEREUM <<--**");
                        (window as any).ethereum.request({
                          method: "eth_requestAccounts",
                        });
                        //   .then(() =>
                        //     (window as any).AlgoSigner.accounts({
                        //       ledger: settings.selectedNetwork,
                        //     })
                        //   )
                        //   .then((accountData: any) => {
                        //     console.log(accountData);
                        //   })
                        //   .catch((e: any) => {
                        //     console.error(e);
                        //   });
                      } else {
                        console.error("NO Ethereum");
                        showErrorToast(
                          "Make sure you have a compatible wallet installed on your browser"
                        );
                      }
                      break;
                  }
                }}
              >
                <FontAwesomeIcon icon={faWallet} className="me-2" />
                <span>Sync Wallet</span>
              </Button>
            </Nav.Item>

            {/* </Dropdown.Toggle> */}

            {/* <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item
                  className="fw-bold"
                  onClick={() => {
                    if (typeof (window as any).AlgoSigner !== "undefined") {
                      (window as any).AlgoSigner.connect()
                        .then(() =>
                          (window as any).AlgoSigner.accounts({
                            ledger: network,
                          })
                        )
                        .then((accountData: any) => {
                          console.log(accountData);
                        })
                        .catch((e: any) => {
                          console.error(e);
                        });
                    } else {
                      console.error("NO AlgoSigner");
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faUserCircle} className="me-2" />{" "}
                  Wallet
                </Dropdown.Item>
                <Dropdown.Item
                  className="fw-bold"
                  onClick={() => {
                    navigate(`/dashboard/settings`);
                  }}
                >
                  <FontAwesomeIcon icon={faCog} className="me-2" /> Settings
                </Dropdown.Item>
              </Dropdown.Menu> */}
            {/* </Dropdown> */}
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};
