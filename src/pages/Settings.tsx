import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCartArrowDown,
  faChartPie,
  faChevronDown,
  faClipboard,
  faCommentDots,
  faFileAlt,
  faPlus,
  faRocket,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Button, Dropdown } from "react-bootstrap";
import { ChoosePhotoWidget, ProfileCardWidget } from "../components/Widgets";
// import { GeneralInfoForm } from "../components/Forms";

import { SettingsForm } from "../components/Forms/SettingsForm";

// import Profile3 from "../assets/img/team/profile-picture-3.jpg";

import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { WidgetB } from "../components/Widgets/WidgetB";

const Settings = () => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        {/* <Button
          onClick={() => {
            console.log("onClick");
            dispatch(increment());
          }}
        >
          Click
        </Button> */}
      </div>

      <Row>
        <Col xs={12}>{}</Col>
      </Row>

      <Row>
        <Col xs={12} xl={8}>
          <SettingsForm accounts={settings.accounts} />
        </Col>

        <Col xs={12} xl={4}>
          <Row>
            <Col xs={12}>
              <WidgetB />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Settings;
