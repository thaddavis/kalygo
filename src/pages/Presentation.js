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
      {/* <Navbar
        variant="dark"
        expand="lg"
        bg="dark"
        className="navbar-transparent navbar-theme-primary sticky-top"
      >
        <Container className="position-relative justify-content-between px-3">
          <Navbar.Brand
            as={HashLink}
            to="#home"
            className="me-lg-3 d-flex align-items-center"
          >
            <span className="ms-2 brand-text d-none d-md-inline">Kalygo</span>
          </Navbar.Brand>

          <div className="d-flex align-items-center">
            <Navbar.Collapse id="navbar-default-primary">
              <Nav className="navbar-nav-hover align-items-lg-center"></Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar> */}
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
              <h1 className="fw-bolder text-secondary display-1 mb-0">
                KALYGO
              </h1>
              <h3 className=" text-secondary mb-4">Escrow</h3>
              {/* <p className="text-muted fw-light mb-3 h5">
                "Because what you put in is what you get out"
              </p> */}
              <div className="d-flex align-items-center justify-content-center mb-0">
                <Button
                  variant="secondary"
                  as={Link}
                  to={RoutesData.DashboardOverview.path}
                  className="text-dark me-3"
                >
                  Enter Dapp
                  {/* <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="d-none d-sm-inline ms-1"
                  /> */}
                </Button>
              </div>
              <div>
                <FontAwesomeIcon
                  style={{ height: 192, width: 192 }}
                  icon={faHive}
                  className="d-block mx-auto py-3 px-4"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section section-md bg-soft" id="features">
        <Container>
          <Row className="justify-content-between align-items-center">
            <Col lg={5} className="order-lg-2 mb-0 mb-lg-0">
              <h2>Powered by Blockchain</h2>
              <p className="mb-3 lead fw-bold">Fast, Secure, and Cheap</p>
              <p className="mb-4">
                Kalygo facilitates stablecoin escrow in a peer-to-peer manner
                using the world's premier blockchains
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section section-lg bg-primary" id="getting-started">
        <Container>
          <Row className="justify-content-center text-center text-white">
            <Col xs={12}>
              <h2 className="fw-light mb-3">
                Less <span className="fw-bold">stress</span>, more{" "}
                <span className="fw-bold">time for you</span>
              </h2>
              <p className="lead px-lg-8">
                Enhance your Real Estate experience with Kalygo
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section section-md bg-white" id="download">
        <Container>
          <Row className="justify-content-end align-items-center">
            <Col lg={5} className="order-lg-2 mb-0 mb-lg-0">
              <div className="text-right">
                <h2>Only the finest</h2>
                <p className="mb-3 lead fw-bold">
                  Audited and Community Vetted
                </p>
                <p className="mb-4">
                  Kalygo prioritizes rigorously vetted contracts and excellent
                  UI/UX. Enter the Dapp to explore Kalygo's premium selection of
                  contracts
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Presentation;
