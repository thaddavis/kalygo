import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faWallet } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { Nav, Navbar, Dropdown, Container, Button } from "react-bootstrap";

import { RootState } from "../store/store";
import { useAppSelector } from "../store/hooks";

interface P {}

const NavbarComponent = (props: P) => {
  const network = useAppSelector(
    (state: RootState) => state.settings.selectedNetwork
  );

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
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                as={Button}
                variant="secondary"
                className="text-dark me-2"
              >
                <FontAwesomeIcon icon={faWallet} className="me-2" />
                <span>Wallet</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
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
                  Connect Wallet
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">
                  <FontAwesomeIcon icon={faCog} className="me-2" /> Settings
                </Dropdown.Item>

                {/* <Dropdown.Item className="fw-bold">
                  <FontAwesomeIcon icon={faUserShield} className="me-2" />{" "}
                  Support
                </Dropdown.Item> */}

                {/* <Dropdown.Divider /> */}

                {/* <Dropdown.Item className="fw-bold">
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="text-danger me-2"
                  />{" "}
                  Disconnect
                </Dropdown.Item> */}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
