import React from "react";
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
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import GitHubButton from "react-github-btn";

import { useNavigate } from "react-router-dom";

import { RoutesData } from "../routes";

import pages from "../data/pages";
import features from "../data/features";

const Presentation = () => {
  const navigate = useNavigate();

  return (
    <>
      <section
        className="section-header overflow-hidden pt-5 pt-lg-6 pb-4 pb-lg-6 bg-primary text-white"
        id="home"
      >
        <Container>
          <Row>
            <Col xs={12} className="text-center">
              <div className="react-big-icon d-none d-lg-block">
                <span className="fab fa-react"></span>
              </div>
              <h1 className="fw-bolder text-secondary display-1 mb-0 ls-6">
                KALYGO
              </h1>
              <h3 className=" text-secondary">Low Code meets Algorand</h3>
              {/* <p className="text-muted fw-light mb-3 h5"></p> */}
              <div className="d-flex align-items-center justify-content-center py-2">
                <Button
                  variant="secondary"
                  size="lg"
                  as={Link}
                  to={RoutesData.DashboardOverview.path}
                  className="text-dark me-3"
                >
                  Enter App
                  {/* <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="d-none d-sm-inline ms-1"
                  /> */}
                </Button>
              </div>
              {/* <div>
                <FontAwesomeIcon
                  style={{ height: 148, width: 148 }}
                  icon={faHive}
                  className="d-block mx-auto py-0 px-4"
                />
              </div> */}
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section section-sm bg-soft" id="features">
        <Container>
          <Row className="justify-content-between align-items-center">
            <Col lg={5} className="order-lg-2 mb-0 mb-lg-0">
              <h1>Secure</h1>
              <p className="mb-2 lead fw-bold">Audited and Community Vetted</p>
              <p className="mb-4">
                Kalygo prioritizes rigorously vetted contracts and excellent
                community experience
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section section-sm bg-primary" id="getting-started">
        <Container>
          <Row className="justify-content-center text-center text-white">
            <Col xs={12}>
              <h1 className="fw-light mb-2">Fast</h1>
              <p className="mb-2">
                <span className="fw-bold">Less stress, more time for you</span>
              </p>
              <p>Block times average about ~3.6 seconds and are final</p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section section-sm bg-white" id="download">
        <Container>
          <Row className="justify-content-end align-items-center">
            <Col lg={5} className="order-lg-2 mb-0 mb-lg-0 text-right">
              <h1>Cheap</h1>
              <p className="mb-2 lead fw-bold">Low Transaction Fees</p>
              <p className="mb-4">
                Algorand's fees are among the lowest in the smart contract
                landscape
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Presentation;
