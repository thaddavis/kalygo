import React, { ReactNode } from "react";

import { faAngleDown, faAngleUp, faChartArea, faChartBar, faChartLine, faFlagUsa, faFolderOpen, faGlobeEurope, faPaperclip, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faAngular, faBootstrap, faReact, faVuejs } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Card, Image, Button, ListGroup, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const WidgetA = (props: any) => {
    const { title, value, percentage } = props;
    const percentageIcon = percentage < 0 ? faAngleDown : faAngleUp;
    const percentageColor = percentage < 0 ? "text-danger" : "text-success";
  
    return (
      <Card className="shadow-sm">
        <Card.Header className="d-md-flex flex-row align-items-center flex-0">
        <>  
        <div className="d-block mb-3 mb-md-0">
            <h5 className="fw-normal mb-2">
              {title}
            </h5>
            <h3>${value}</h3>
            <small className="fw-bold mt-2">
              <span className="me-2">Yesterday</span>
              <FontAwesomeIcon icon={percentageIcon} className={`${percentageColor} me-1`} />
              <span className={percentageColor}>
                {percentage}%
              </span>
            </small>
          </div>
          <div className="d-flex ms-auto">
            <Button variant="secondary" size="sm" className="me-2">Month</Button>
            <Button variant="primary" size="sm" className="me-3">Week</Button>
          </div>
          </>
        </Card.Header>
        <Card.Body className="p-2">
          {/* <SalesValueChartphone /> */}
          Hello World!
        </Card.Body>
      </Card>
    );
};