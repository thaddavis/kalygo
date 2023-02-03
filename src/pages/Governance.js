import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faFolder } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faHive } from "@fortawesome/free-brands-svg-icons";
import {
  Col,
  Row,
  Card,
  Image,
  Button,
  Container,
  Navbar,
  Nav,
  Badge,
  ListGroup,
} from "react-bootstrap";
import axios from "axios";
import { ethers } from "ethers";
import { get } from "lodash";

// {
//   theKey: string,
//   value: string,
// }
const CustomRow = (props) => {
  const { theKey, value } = props;

  return (
    <ListGroup.Item className="px-0 pt-0">
      <Row className="align-items-center">
        <Col className="col-auto mb-0 py-0">
          <h6 className="h6 mb-0 fw-bolder">{theKey}</h6>
        </Col>
        <Col className="col-auto mb-0 py-0">
          <h6 className="h6 mb-0">{value}</h6>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export function Governance() {
  let [tokenMetadata, setTokenMetadata] = useState({
    val: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    console.log("Governance");
    async function fetch() {
      try {
        console.log("fetch");
        const provider = new ethers.providers.JsonRpcProvider(
          "https://virulent-smart-dream.discover.quiknode.pro/bf18a1026d8aa87ae439779802efb92be937e564/"
        );
        console.log("provider =>", provider);
        const tokenMetadata = await provider.send(
          "qn_getTokenMetadataByContractAddress",
          {
            contract: "0xeC63aE1781A29B10d4bd27b492D017310e871efB",
          }
        );

        setTokenMetadata({
          val: tokenMetadata,
          loading: false,
          error: null,
        });
      } catch (e) {
        setTokenMetadata({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    // setTokenMetadata({
    //   val: tokenMetadata,
    //   loading: true,
    //   error: null,
    // });
    fetch();
  }, []);

  return (
    <Container className="px-0">
      <Row>
        <Col xs={12} className="p-3">
          <Card>
            <Card.Body>
              <article className="py-4">
                <h1 id="governance">Governance </h1>
                <p>Kalygo is an open source platform.</p>
                <p>
                  Standard jurisdictional fees (ie: 3% realtor commissions/1-2%
                  title fees/etc.) apply.
                </p>
                <p>
                  Company ownership is bonded to the ERC-20 token linked below
                </p>
                <p>
                  <a
                    href="https://thirdweb.com/ethereum/0xeC63aE1781A29B10d4bd27b492D017310e871efB/"
                    target="_blank"
                  >
                    Official Kalygo ERC-20
                  </a>
                </p>

                <ListGroup className="list-group-flush list my--3">
                  <CustomRow
                    theKey={"Token Name"}
                    value={
                      get(tokenMetadata, "loading")
                        ? "..."
                        : get(tokenMetadata, "val.contract.name", "Not Found")
                    }
                  />
                  <CustomRow
                    theKey={"Token Symbol"}
                    value={
                      get(tokenMetadata, "loading")
                        ? "..."
                        : get(tokenMetadata, "val.contract.symbol", "Not Found")
                    }
                  />
                </ListGroup>
              </article>

              <article className="py-4">
                <h1 id="getting-support">Getting support</h1>
                <p>
                  Please{" "}
                  <Card.Link href="https://cmdlabs.io" target="_blank">
                    contact us
                  </Card.Link>{" "}
                  !
                </p>
              </article>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
