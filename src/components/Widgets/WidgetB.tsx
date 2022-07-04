import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faChartArea,
  faChartBar,
  faChartLine,
  faFlagUsa,
  faFolderOpen,
  faGlobeEurope,
  faPaperclip,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  faAngular,
  faBootstrap,
  faReact,
  faVuejs,
} from "@fortawesome/free-brands-svg-icons";
import {
  Col,
  Row,
  Card,
  Image,
  Button,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import {
  CircleChart,
  BarChart,
  SalesValueChart,
  SalesValueChartphone,
} from "../Charts";

import Profile1 from "../../assets/img/team/profile-picture-1.jpg";
import ProfileCover from "../../assets/img/profile-cover.jpg";

import teamMembers from "../../data/teamMembers";
import { RootState } from "../../store/store";
import { useAppSelector } from "../../store/hooks";

export const WidgetB = () => {
  const settings = useAppSelector((state: RootState) => state.settings);

  return (
    <Card border="light" className="text-center p-0 mb-4">
      {/* <div
        style={{ backgroundImage: `url(${ProfileCover})` }}
        className="profile-cover rounded-top"
      /> */}
      <Card.Body className="pb-0">
        {/* <Card.Img
          src={Profile1}
          alt="Neil Portrait"
          className="user-avatar large-avatar rounded-circle mx-auto mt-n7 mb-4"
        /> */}
        <Card.Title>Operator Config</Card.Title>
        <Card.Subtitle className="fw-normal">
          {settings.selectedNetwork}
        </Card.Subtitle>
        <Card.Text className="text-gray mb-4">
          {/* New York, USA */}
          {settings.selectedAccount}
        </Card.Text>

        {/* <Button variant="primary" size="sm" className="me-2">
          <FontAwesomeIcon icon={faUserPlus} className="me-1" /> Connect
        </Button>
        <Button variant="secondary" size="sm">
          Send Message
        </Button> */}
      </Card.Body>
    </Card>
  );
};
