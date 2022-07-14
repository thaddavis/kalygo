import {
  Col,
  Row,
  Card,
  Image,
  Button,
  ListGroup,
  ProgressBar,
  Table,
} from "react-bootstrap";

import { pageVisits, pageTraffic, pageRanking } from "../../data/tables";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faChartArea,
  faChartBar,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faAngular,
  faBootstrap,
  faReact,
  faVuejs,
} from "@fortawesome/free-brands-svg-icons";

interface P {
  events: any;
}

export const EscrowContractTimelineWidget = (props: P) => {
  let { events } = props;

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5>Timeline</h5>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <section className="timeline-wrapper">
          <div className="middle-line"></div>
          {events.map((i: any, idx: number) => {
            return (
              <div className={`box`} key={idx}>
                <div className={`dot ${i.color}`}></div>
              </div>
            );
          })}
        </section>
      </Card.Body>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Milestone</th>
            <th scope="col">Color</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {events.map((i: any, idx: number) => {
            return (
              <tr key={idx}>
                <td>{i.title}</td>
                <td style={{ color: i.color }}>
                  <FontAwesomeIcon icon={faCircle} className="me-1" />
                </td>
                <td>{new Date(i.time).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};
