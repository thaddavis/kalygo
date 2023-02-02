import React from "react";
import { Row, Col, Card, Container } from "react-bootstrap";

export function Support() {
  return (
    <Container className="px-0">
      <Row>
        <Col xs={12} className="p-3">
          <Card>
            <Card.Body>
              <article>
                <h1 className="h2" id="support">
                  Support{" "}
                </h1>

                <p>
                  Kalygo is an open source marketplace for hands-on interaction
                  with the world's most popular smart contract blockchains.
                </p>
                <p>
                  This product is designed for the following blockchains and
                  wallets...
                </p>
                <ul className="docs-list">
                  <li>
                    Ethereum{" "}
                    <Card.Link href="https://metamask.io/" target="_blank">
                      MetaMask
                    </Card.Link>
                  </li>
                  <li>
                    Algorand{" "}
                    <Card.Link
                      href="https://www.purestake.com/technology/algosigner/"
                      target="_blank"
                    >
                      AlgoSigner
                    </Card.Link>
                  </li>
                  <li>
                    Solana{" "}
                    <Card.Link href="https://solana.com/" target="_blank">
                      Coming Soon...
                    </Card.Link>
                  </li>
                  <li>
                    Avalanche{" "}
                    <Card.Link href="https://www.avax.network/" target="_blank">
                      Coming Soon...
                    </Card.Link>
                  </li>
                  <li>
                    Cardano{" "}
                    <Card.Link href="https://cardano.org/" target="_blank">
                      Coming Soon...
                    </Card.Link>
                  </li>
                </ul>

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
