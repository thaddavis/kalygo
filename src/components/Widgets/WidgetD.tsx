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

          {/* <div className="box box-top">
            <div className="date"></div>
          </div>

          <div className="box box-top">
            <div className="date"></div>
          </div>

          <div className="box box-top">
            <div className="date"></div>
          </div>  */}
        </section>
      </Card.Body>
      <Table responsive className="align-items-center table-flush">
        <thead className="thead-light">
          <tr>
            <th scope="col">Milestone</th>
            <th scope="col">Color</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Now</td>
            <td style={{ color: "purple" }}>
              <FontAwesomeIcon icon={faCircle} className="me-1" />
            </td>
          </tr>
          <tr>
            <td>Inspection Begin</td>
            <td style={{ color: "red" }}>
              <FontAwesomeIcon icon={faCircle} className="me-1" />
            </td>
          </tr>
          <tr>
            <td>Inspection End</td>
            <td style={{ color: "orange" }}>
              <FontAwesomeIcon icon={faCircle} className="me-1" />
            </td>
          </tr>
          <tr>
            <td>Closing Date</td>
            <td style={{ color: "green" }}>
              <FontAwesomeIcon icon={faCircle} className="me-1" />
            </td>
          </tr>
        </tbody>
      </Table>
    </Card>
  );
};
