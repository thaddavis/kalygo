import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Outlet } from "react-router-dom";
import get from "lodash/get";

import { Col, Row, Button, Dropdown } from "react-bootstrap";
import { SettingsForm } from "../components/Forms/SettingsForm";

import { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { OperatorConfig } from "../components/Widgets/OperatorConfig";
import { Algod } from "../services/algod";
import { useParams } from "react-router-dom";
import { parseGlobalState } from "./customSelectors/appl/parseGlobalState";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { RolesWidget } from "../components/Widgets/RolesWidget";
import { EscrowContractTimelineWidget } from "../components/Widgets/ContractTimelineWidget";
import { EscrowWidget } from "../components/Widgets/EscrowWidget";
import { FlagsWidget } from "../components/Widgets/FlagsWidget";

import algosdk from "algosdk";
import { ActionsWidget } from "../components/Widgets/ActionsWidget";

function AppDetail() {
  const [app, setApp] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  const [account, setAccount] = useState<any>({
    val: undefined,
    loading: false,
    error: undefined,
  });

  const settings = useAppSelector((state: RootState) => state.settings);

  let { id } = useParams();

  useEffect(() => {
    async function fetch() {
      try {
        const appResponse = await Algod.getIndexer(settings.selectedNetwork)
          .lookupApplications(Number.parseInt(id!))
          .do();

        setApp({
          val: parseGlobalState(
            appResponse?.application?.params &&
              appResponse.application.params["global-state"]
          ),
          loading: false,
          error: null,
        });
      } catch (e) {
        setApp({
          val: null,
          loading: false,
          error: e,
        });
      }
    }

    fetch();
  }, []);

  // useEffect(() => {
  //   async function fetch() {
  //     try {
  //       const appResponse = await Algod.getIndexer(settings.selectedNetwork)
  //         .lookupApplications(Number.parseInt(id!))
  //         .do();

  //       setApp({
  //         val: parseGlobalState(
  //           appResponse?.application?.params &&
  //             appResponse.application.params["global-state"]
  //         ),
  //         loading: false,
  //         error: null,
  //       });

  //       const appAddress = await algosdk.getApplicationAddress(
  //         Number.parseInt(id!)
  //       );

  //       const accountResponse = await Algod.getAlgod(settings.selectedNetwork)
  //         .accountInformation(appAddress)
  //         .do();

  //       setAccount({
  //         val: accountResponse,
  //         loading: false,
  //         error: null,
  //       });
  //     } catch (e) {
  //       setApp({
  //         val: null,
  //         loading: false,
  //         error: e,
  //       });
  //     }
  //   }

  //   fetch();
  // }, []);

  return <Outlet />;
}

export default AppDetail;
