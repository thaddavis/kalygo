import React from "react";

import { Col, Row, Button, Dropdown } from "react-bootstrap";
import { SettingsForm } from "../components/Forms/SettingsForm";

import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { OperatorConfig } from "../components/Widgets/OperatorConfig";

const Settings = () => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4"></div>

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
              <OperatorConfig />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Settings;
