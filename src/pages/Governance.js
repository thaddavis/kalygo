import React, { useEffect } from "react";
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

export function Governance() {
  useEffect(() => {
    console.log("Governance");
    async function fetch() {
      console.log("fetch");
      const provider = new ethers.providers.JsonRpcProvider(
        "https://virulent-smart-dream.discover.quiknode.pro/bf18a1026d8aa87ae439779802efb92be937e564/"
      );
      console.log("provider =>", provider);
      console.log("0");
      console.log("1");
      // provider.connection.headers = { "x-qn-api-version": 1 };
      // console.log("1");
      const heads1 = await provider.send(
        "qn_getTokenMetadataByContractAddress",
        {
          contract: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
        }
      );

      const heads2 = await provider.send(
        "qn_getTokenMetadataByContractAddress",
        {
          contract: "0xeC63aE1781A29B10d4bd27b492D017310e871efB",
        }
      );
      console.log("1");
      console.log(heads1);
      console.log("2");
      console.log(heads2);
    }

    fetch();

    // axios
    //   .post(
    //     "https://virulent-smart-dream.discover.quiknode.pro/bf18a1026d8aa87ae439779802efb92be937e564/",
    //     {
    //       id: 67,
    //       jsonrpc: "2.0",
    //       method: "qn_getTokenMetadataByContractAddress",
    //       params: {
    //         contract: "0xeC63aE1781A29B10d4bd27b492D017310e871efB",
    //       },
    //     },
    //     {
    //       //   headers: {
    //       //     "x-qn-api-version": "1",
    //       //   },
    //     }
    //   )
    //   .then(function (response) {
    //     // handle success
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     // handle error
    //     console.log(error);
    //   })
    //   .then(function () {
    //     // always executed
    //   });
  }, []);

  return (
    <Container className="px-0">
      <Row>
        <Col xs={12} className="p-3">
          <Card>
            <Card.Body>
              <article>
                <h1 className="h2" id="governance">
                  Governance{" "}
                </h1>
                <p>
                  Kalygo is an open source platform. A 0.3% fees is ADDED to all
                  sales service through Kalygo.io. All revenue generated from
                  the platform are distributed to holders of the ERC-20 token
                  linked below and standard jurisdictional fees (ie: 3% realtor
                  commissions/1-2% titling fees/etc.) are applied to and
                  distribute to members of the official DAO.
                </p>
                <p>
                  <a
                    href="https://thirdweb.com/ethereum/0xeC63aE1781A29B10d4bd27b492D017310e871efB/"
                    target="_blank"
                  >
                    Official Kalygo ERC-20
                  </a>
                </p>

                <h2 id="getting-support">Getting support</h2>
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
