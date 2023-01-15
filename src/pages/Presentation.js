import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faExternalLinkAlt,
  fa,
  faTimesCircle,
  faCheckCircle,
  faCalendarAlt,
  faCodeBranch,
  faShoppingCart,
  faFolder,
  faMapMarkedAlt,
  faPager,
  faFileCode,
  faDownload,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import {
  faBootstrap,
  faGithub,
  faHive,
  faJs,
  faReact,
  faSass,
} from "@fortawesome/free-brands-svg-icons";
import {
  Col,
  Row,
  Card,
  Image,
  Button,
  Container,
  ListGroup,
  Tooltip,
  Form,
  Navbar,
  Nav,
  Badge,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import GitHubButton from "react-github-btn";

import { RoutesData } from "../routes";
import ThemesbergLogoIcon from "../assets/img/themesberg.svg";
import ThemesbergLogo from "../assets/img/themesberg-logo.svg";
import BlockchainSvg from "../assets/img/icons/blockchain.svg";
import MockupPresentation from "../assets/img/mockup-presentation.png";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import MapboxImg from "../assets/img/mockup-map-presentation.png";
import CalendarImg from "../assets/img/mockup-calendar-presentation.png";
import ReactMockupImg from "../assets/img/react-mockup.png";
import BS5IllustrationsImg from "../assets/img/illustrations/bs5-illustrations.svg";
import BS5Logo from "../assets/img/technologies/bootstrap-5-logo.svg";
import ReactLogo from "../assets/img/technologies/react-logo.svg";

import pages from "../data/pages";
import features from "../data/features";

const Presentation = () => {
  const PagePreview = (props) => {
    const { name, image, link } = props;

    return (
      <Col xs={6} className="mb-5">
        <Card.Link
          as={Link}
          to={link}
          className="page-preview page-preview-lg scale-up-hover-2"
        >
          <Image
            src={image}
            className="shadow-lg rounded scale"
            alt="Dashboard page preview"
          />

          <div className="text-center show-on-hover">
            <h6 className="m-0 text-center text-white">
              {name}{" "}
              <FontAwesomeIcon icon={faExternalLinkAlt} className="ms-2" />
            </h6>
          </div>
        </Card.Link>
      </Col>
    );
  };

  const Feature = (props) => {
    const { title, description, icon } = props;

    return (
      <Col xs={12} sm={6} lg={3}>
        <Card className="bg-white shadow-soft text-primary rounded mb-4">
          <div className="px-3 px-lg-4 py-5 text-center">
            <span className="icon icon-lg mb-4">
              <FontAwesomeIcon icon={icon} />
            </span>
            <h5 className="fw-bold text-primary">{title}</h5>
            <p>{description}</p>
          </div>
        </Card>
      </Col>
    );
  };

  const FolderItem = (props) => {
    const { name, icon, tooltip, iconColor } = props;
    const color = iconColor ? `text-${iconColor}` : "";

    return (
      // <OverlayTrigger
      //   trigger={['hover', 'focus']}
      //   placement="left"
      //   overlay={<Tooltip>{tooltip}</Tooltip>}
      // >
      <li
        data-toggle="tooltip"
        data-placement="left"
        title="Main folder that you will be working with"
      >
        <FontAwesomeIcon
          icon={icon ? icon : faFolder}
          className={`${color} me-2`}
        />{" "}
        {name}
      </li>
      // </OverlayTrigger>
    );
  };

  return (
    <>
      <Navbar
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
              <Nav className="navbar-nav-hover align-items-lg-center">
                <Nav.Link as={HashLink} to="#features">
                  Features
                </Nav.Link>
                {/* <Nav.Link as={HashLink} to="#pages">Pages</Nav.Link>
                <Nav.Link as={HashLink} to="#folder" className="d-sm-none d-xl-inline">Folder Structure</Nav.Link>
                <Nav.Link as={HashLink} to="#getting-started">Getting Started</Nav.Link>
                <Nav.Link as={HashLink} to="#download">Upgrade to Pro</Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
            {/* <Button as={HashLink} to="#download" variant="outline-white" className="ms-3"><FontAwesomeIcon icon={faDownload} className="me-1" /> Download</Button> */}
          </div>
        </Container>
      </Navbar>
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
              <h1 className="fw-bolder text-secondary display-1">KALYGO</h1>
              <p className="text-muted fw-light mb-2 h5">Peer-to-Peer Tools</p>
              <div className="d-flex align-items-center justify-content-center mb-4">
                <Button
                  variant="secondary"
                  as={Link}
                  to={RoutesData.DashboardOverview.path}
                  className="text-dark me-3"
                >
                  Explore App{" "}
                  <FontAwesomeIcon
                    icon={faExternalLinkAlt}
                    className="d-none d-sm-inline ms-1"
                  />
                </Button>
              </div>
              <div>
                <FontAwesomeIcon
                  style={{ height: 256, width: 256 }}
                  icon={faHive}
                  className="d-block mx-auto py-4 px-4"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <div className="section pt-0">
        <Container className="mt-n10 mt-lg-n12 z-2">
          <Row className="justify-content-center mt-5 mt-lg-6"></Row>
        </Container>
      </div> */}
      <section className="section section-md bg-soft" id="features">
        <Container>
          <Row className="justify-content-between align-items-center">
            <Col lg={5} className="order-lg-2 mb-5 mb-lg-0">
              <h2>Powered by Blockchain</h2>
              <p className="mb-3 lead fw-bold">Fast and Cheap</p>
              <p className="mb-4">
                Kalygo a hub of real-world applicable smarts contracts running
                on either the Ethereum, Algorand, or Solana Blockchains.
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
                Less <span className="fw-bold">hassle</span>, more{" "}
                <span className="fw-bold">time for you</span>.
              </h2>
              <p className="lead px-lg-8">
                Enhance your experience with Kalygo. Peer-to-Peer tools running
                on the world's biggest smart-contract platforms.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section section-lg bg-white" id="download">
        <Container>
          <Row>
            <Col xs={12} lg={8}>
              <h2 className="fw-light mb-3">
                Peer-2-Peer with arbitration fallback
              </h2>
              <p className="lead mb-4 me-lg-6">
                In the case of a dispute, Kalygo smart contracts offer
                arbitration fallback.
              </p>
            </Col>
            {/* <Col xs={12} lg={4}>
              <div className="github-big-icon">
                <FontAwesomeIcon icon={faGithub} />
              </div>
            </Col> */}
          </Row>
          <Row className="mt-lg-6">
            <Col xs={12} className="text-center">
              <div></div>
            </Col>
          </Row>
        </Container>
      </section>
      <footer className="footer py-6 bg-dark text-white">
        <Container>
          <Row>
            <Col md={12}>
              <div className="d-flex text-center justify-content-center align-items-center">
                {/* <Navbar.Brand as={HashLink} to="#home" className="me-lg-3 mb-3 d-flex align-items-center">
                  <Image src={ReactHero} />
                  <span className="ms-2 brand-text">Kalygo</span>
                </Navbar.Brand> */}
                <p>
                  Kalygo is a free and open source platform for peer-to-peer
                  contracts with arbitration fallbacks.
                </p>
              </div>
            </Col>
            {/* <Col xs={6} md={2} className="mb-5 mb-lg-0">
              <span className="h5">Themesberg</span>
              <ul className="links-vertical mt-2">
                <li><Card.Link target="_blank" href="https://themesberg.com/blog">Blog</Card.Link></li>
                <li><Card.Link target="_blank" href="https://themesberg.com/products">Products</Card.Link></li>
                <li><Card.Link target="_blank" href="https://themesberg.com/about">About Us</Card.Link></li>
                <li><Card.Link target="_blank" href="https://themesberg.com/contact">Contact Us</Card.Link></li>
              </ul>
            </Col> */}
            {/* <Col xs={6} md={2} className="mb-5 mb-lg-0">
              <span className="h5">Other</span>
              <ul className="links-vertical mt-2">
                <li>
                  <Card.Link as={Link} to={RoutesData.DocsQuickStart.path} target="_blank">Getting started</Card.Link>
                </li>
                <li><Card.Link as={Link} to={RoutesData.DocsChangelog.path} target="_blank">Changelog</Card.Link></li>
                <li><Card.Link target="_blank" href="https://themesberg.com/licensing">License</Card.Link></li>
              </ul>
            </Col> */}
            {/* <Col xs={12} md={4} className="mb-5 mb-lg-0">
              <span className="h5 mb-3 d-block">Subscribe</span>
              <form action="#">
                <div className="form-row mb-2">
                  <div className="col-12">
                    <input type="email" className="form-control mb-2" placeholder="example@company.com" name="email" aria-label="Subscribe form" required />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-secondary text-dark shadow-soft btn-block" data-loading-text="Sending">
                      <span>Subscribe</span>
                    </button>
                  </div>
                </div>
              </form>
              <p className="text-muted font-small m-0">We’ll never share your details. See our <Card.Link className="text-white" href="#">Privacy Policy</Card.Link></p>
            </Col> */}
          </Row>
          <hr className="bg-gray my-5" />
          <Row>
            <Col className="mb-md-2">
              {/* <Card.Link href="https://themesberg.com" target="_blank" className="d-flex justify-content-center">
                <Image src={ThemesbergLogo} height={35} className="d-block mx-auto mb-3" alt="Themesberg Logo" />
              </Card.Link> */}
              <div
                className="d-flex text-center justify-content-center align-items-center"
                role="contentinfo"
              >
                <p className="font-weight-normal font-small mb-0">
                  Copyright © COMMAND -
                  <span className="current-year">
                    {new Date().getFullYear()}
                  </span>
                  . All rights reserved.
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="mb-md-2">
              <br />
              <div
                className="d-flex text-center justify-content-center align-items-center py-2"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  window.open("https://github.com/thaddavis/kalygo", "_blank");
                }}
              >
                Frontend -&nbsp;
                <FontAwesomeIcon
                  style={{ height: 32, width: 32 }}
                  icon={faGithub}
                />
              </div>
              <div
                className="d-flex text-center justify-content-center align-items-center  py-2"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  window.open(
                    "https://github.com/thaddavis/kalygo_contracts",
                    "_blank"
                  );
                }}
              >
                Contracts -&nbsp;
                <FontAwesomeIcon
                  style={{ height: 32, width: 32 }}
                  icon={faGithub}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Presentation;
