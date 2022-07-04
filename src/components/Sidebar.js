
import React, { useState } from "react";
import SimpleBar from 'simplebar-react';
import { useLocation } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBoxOpen, faChartPie, faCog, faFileAlt, faHandHoldingUsd, faSignOutAlt, faTable, faTimes, faCalendarAlt, faMapPin, faInbox, faRocket } from "@fortawesome/free-solid-svg-icons";
import { Nav, Badge, Image, Button, Dropdown, Accordion, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { RoutesData } from "../routes";
import ThemesbergLogo from "../assets/img/themesberg.svg";
import ReactHero from "../assets/img/technologies/react-hero-logo.svg";
import ProfilePicture from "../assets/img/team/profile-picture-3.jpg";

const Sidebar = (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? "show" : "";

  const onCollapse = () => setShow(!show);

  const CollapsableNavItem = (props) => {
    const { eventKey, title, icon, children = null } = props;
    const defaultKey = pathname.indexOf(eventKey) !== -1 ? eventKey : "";

    return (
      <Accordion as={Nav.Item} defaultActiveKey={defaultKey}>
        <Accordion.Item eventKey={eventKey}>
          <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
            <span>
              <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span>
              <span className="sidebar-text">{title}</span>
            </span>
          </Accordion.Button>
          <Accordion.Body className="multi-level">
            <Nav className="flex-column">
              {children}
            </Nav>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const NavItem = (props) => {
    const { title, link, external, target, icon, image, badgeText, badgeBg = "secondary", badgeColor = "primary" } = props;
    const classNames = badgeText ? "d-flex justify-content-start align-items-center justify-content-between" : "";
    const navItemClassName = link === pathname ? "active" : "";
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? <span className="sidebar-icon"><FontAwesomeIcon icon={icon} /> </span> : null}
            {image ? <Image src={image} width={20} height={20} className="sidebar-icon svg-icon" /> : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">{badgeText}</Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar expand={false} collapseOnSelect variant="dark" className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand className="me-lg-5" as={Link} to={RoutesData.DashboardOverview.path}>
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle as={Button} aria-controls="main-navbar" onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image src={ProfilePicture} className="card-img-top rounded-circle border-white" />
                </div>
                <div className="d-block">
                  <h6>Hi, Jane</h6>
                  <Button as={Link} variant="secondary" size="xs" to={RoutesData.Signin.path} className="text-dark">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItem title="Kalygo" link={RoutesData.Presentation.path} image={ReactHero} />

              <NavItem title="Overview" link={RoutesData.DashboardOverview.path} icon={faChartPie} />
              {/* <NavItem external title="Messages" link="https://demo.themesberg.com/volt-pro-react/#/messages" target="_blank" badgeText="Pro" icon={faInbox} /> */}
              <NavItem title="Transactions" icon={faHandHoldingUsd} link={RoutesData.Transactions.path} />
              <NavItem title="Settings" icon={faCog} link={RoutesData.Settings.path} />
              {/* <NavItem external title="Calendar" link="https://demo.themesberg.com/volt-pro-react/#/calendar" target="_blank" badgeText="Pro" icon={faCalendarAlt} />
              <NavItem external title="Map" link="https://demo.themesberg.com/volt-pro-react/#/map" target="_blank" badgeText="Pro" icon={faMapPin} /> */}

              {/* <CollapsableNavItem eventKey="tables/" title="Tables" icon={faTable}>
                <NavItem title="Bootstrap Table" link={RoutesData.BootstrapTables.path} />
              </CollapsableNavItem> */}

              {/* <CollapsableNavItem eventKey="examples/" title="Page Examples" icon={faFileAlt}>
                <NavItem title="Sign In" link={RoutesData.Signin.path} />
                <NavItem title="Sign Up" link={RoutesData.Signup.path} />
                <NavItem title="Forgot password" link={RoutesData.ForgotPassword.path} />
                <NavItem title="Reset password" link={RoutesData.ResetPassword.path} />
                <NavItem title="Lock" link={RoutesData.Lock.path} />
                <NavItem title="404 Not Found" link={RoutesData.NotFound.path} />
                <NavItem title="500 Server Error" link={RoutesData.ServerError.path} />
              </CollapsableNavItem> */}

              {/* <NavItem external title="Plugins" link="https://demo.themesberg.com/volt-pro-react/#/plugins/datatable" target="_blank" badgeText="Pro" icon={faChartPie} /> */}

              <Dropdown.Divider className="my-3 border-indigo" />

              {/* <CollapsableNavItem eventKey="documentation/" title="Getting Started" icon={faBook}>
                <NavItem title="Overview" link={RoutesData.DocsOverview.path} />
                <NavItem title="Download" link={RoutesData.DocsDownload.path} />
                <NavItem title="Quick Start" link={RoutesData.DocsQuickStart.path} />
                <NavItem title="License" link={RoutesData.DocsLicense.path} />
                <NavItem title="Folder Structure" link={RoutesData.DocsFolderStructure.path} />
                <NavItem title="Build Tools" link={RoutesData.DocsBuild.path} />
                <NavItem title="Changelog" link={RoutesData.DocsChangelog.path} />
              </CollapsableNavItem> */}
              {/* <CollapsableNavItem eventKey="components/" title="Components" icon={faBoxOpen}>
                <NavItem title="Accordion" link={RoutesData.Accordions.path} />
                <NavItem title="Alerts" link={RoutesData.Alerts.path} />
                <NavItem title="Badges" link={RoutesData.Badges.path} />
                <NavItem external title="Widgets" link="https://demo.themesberg.com/volt-pro-react/#/components/widgets" target="_blank" badgeText="Pro" />
                <NavItem title="Breadcrumbs" link={RoutesData.Breadcrumbs.path} />
                <NavItem title="Buttons" link={RoutesData.Buttons.path} />
                <NavItem title="Forms" link={RoutesData.Forms.path} />
                <NavItem title="Modals" link={RoutesData.Modals.path} />
                <NavItem title="Navbars" link={RoutesData.Navbars.path} />
                <NavItem title="Navs" link={RoutesData.Navs.path} />
                <NavItem title="Pagination" link={RoutesData.Pagination.path} />
                <NavItem title="Popovers" link={RoutesData.Popovers.path} />
                <NavItem title="Progress" link={RoutesData.Progress.path} />
                <NavItem title="Tables" link={RoutesData.Tables.path} />
                <NavItem title="Tabs" link={RoutesData.Tabs.path} />
                <NavItem title="Toasts" link={RoutesData.Toasts.path} />
                <NavItem title="Tooltips" link={RoutesData.Tooltips.path} />
              </CollapsableNavItem> */}
              {/* <NavItem external title="Themesberg" link="https://themesberg.com" target="_blank" image={ThemesbergLogo} /> */}
              {/* <Button as={Link} to={RoutesData.Upgrade.path} variant="secondary" className="upgrade-to-pro"><FontAwesomeIcon icon={faRocket} className="me-1" /> Upgrade to Pro</Button> */}
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};

export default Sidebar