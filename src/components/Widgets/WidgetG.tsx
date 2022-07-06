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

interface P {
  buyer: string;
  seller: string;
  creator: string;
  arbiter: string;
  operator: string;
}

export const ActionsWidget = (props: P) => {
  const { buyer, seller, creator, arbiter, operator } = props;

  const settings = useAppSelector((state: RootState) => state.settings);

  return (
    <Card border="light" className="text-center p-0 mb-4">
      <Card.Body className="pb-0 mb-4">
        <Card.Title>
          {operator === buyer && "Buyer"}
          {operator === seller && "Seller"}
          {operator === arbiter && "Arbiter"}
          {operator === creator && "Creator"}
        </Card.Title>
        <Card.Subtitle className="fw-normal">Actions</Card.Subtitle>

        {operator === buyer && (
          <>
            <Button variant="secondary" size="sm" className="m-1">
              Fund Initial Amount
            </Button>
            <Button variant="secondary" size="sm" className="m-1">
              Send 1st Escrow
            </Button>
            <Button variant="secondary" size="sm" className="m-1">
              Send 2nd Escrow
            </Button>
            <Button variant="secondary" size="sm" className="m-1">
              Signal Arbitration
            </Button>
            <Button variant="secondary" size="sm" className="m-1">
              Signal Pull Out
            </Button>
            <Button variant="secondary" size="sm" className="m-1">
              Buyer Withdraw Escrow
            </Button>
          </>
        )}

        {operator === seller && (
          <>
            <Button variant="secondary" size="sm" className="m-1">
              Withdraw Escrow
            </Button>
          </>
        )}

        {operator === creator && (
          <>
            <Button variant="secondary" size="sm" className="m-1">
              Delete App
            </Button>
          </>
        )}

        {operator === arbiter && (
          <>
            <Button variant="secondary" size="sm" className="m-1">
              Send Holdings to Buyer
            </Button>
            <Button variant="secondary" size="sm" className="m-1">
              Send Holdings to Seller
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
