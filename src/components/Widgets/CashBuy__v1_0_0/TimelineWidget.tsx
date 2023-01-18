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

import { pageVisits, pageTraffic, pageRanking } from "../../../data/tables";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

interface P {
  events: any;
}

export const TimelineWidget = (props: P) => {
  let { events } = props;

  return (
    <Card border="light" className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">Timeline</h5>
          </Col>
        </Row>
      </Card.Header>
      {/* <Card.Body> */}
      {/* <section className="timeline-wrapper">
          <div className="middle-line"></div>
          {events.map((i: any, idx: number) => {
            return (
              <div className={`box`} key={idx}>
                <div className={`dot ${i.color}`}></div>
              </div>
            );
          })}
        </section> */}
      <Table responsive className="align-items-center table-flush">
        {/* <thead className="thead-light">
            <tr>
              <th scope="col">Milestone</th>
              <th scope="col">Color</th>
              <th scope="col">Date</th>
            </tr>
          </thead> */}
        <tbody>
          {events.map((i: any, idx: number) => {
            console.log("i", i);

            return (
              <tr key={idx}>
                <td>
                  {i.title}
                  <i>
                    {i.title === "Inspection Ends" &&
                      " - Buyer pullout allowed before"}
                    {i.title === "Closing Date" &&
                      " - Arbitration flags allowed before"}
                    {i.title === "Free Funds Date" &&
                      " - Extension for response arbitration flag"}
                    {i.title === "Inspection Extension" &&
                      " - On pullout buyer funds freed (if no arbitration)"}
                  </i>
                </td>
                <td style={{ color: i.color }}>
                  <FontAwesomeIcon icon={faCircle} className="me-1" />
                </td>
                <td>{new Date(i.time).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {/* </Card.Body> */}
    </Card>
  );
};
