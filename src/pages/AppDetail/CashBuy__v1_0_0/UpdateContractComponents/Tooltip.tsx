import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay";
import Popover from "react-bootstrap/Popover";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export function Tooltip() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event: any) => {
    setShow(!show);
    setTarget(event.target);
  };

  return (
    <div ref={ref}>
      <span onClick={handleClick}>
        <FontAwesomeIcon icon={faCircleInfo} />
      </span>

      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref}
        containerPadding={20}
      >
        <Popover id="popover-contained">
          <Popover.Header as="h3">Disclaimer</Popover.Header>
          <Popover.Body>
            If your proposed contract updates are the same as the other parties
            proposed updates then the updates will be applied.
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}
