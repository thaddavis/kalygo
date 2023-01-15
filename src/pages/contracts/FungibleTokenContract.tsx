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
import { SettingsForm } from "../../components/Forms/SettingsForm";

import { RootState } from "../../store/store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { OperatorConfig } from "../../components/Widgets/OperatorConfig";
import { FungibleTokenContractForm } from "../../components/Forms/FungibleTokenContractForm";

const FungibleTokenContract = () => {
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <h1>Fungible Token</h1>
      </div>

      <Row>
        <Col xs={12} xl={4}>
          <Row>
            <Col xs={12}>
              <OperatorConfig />
            </Col>
          </Row>
        </Col>

        <Col xs={12} xl={8}>
          <FungibleTokenContractForm accounts={settings.accounts} />
        </Col>
      </Row>
    </>
  );
};

export default FungibleTokenContract;
