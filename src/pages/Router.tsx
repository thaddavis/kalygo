import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { RoutesData } from "../routes";

import { ToastContainer, toast } from "react-toastify";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import BlockchainOverview from "./BlockchainOverview";
import Settings from "./Settings";
import FinanceDealContract from "./contracts/FinanceDealContract";
import CashBuyContract from "./contracts/CashBuyContract";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// documentation pages
// import DocsOverview from "./documentation/DocsOverview";
// import DocsDownload from "./documentation/DocsDownload";
// import DocsQuickStart from "./documentation/DocsQuickStart";
// import DocsLicense from "./documentation/DocsLicense";
// import DocsFolderStructure from "./documentation/DocsFolderStructure";
// import DocsBuild from "./documentation/DocsBuild";
// import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

// import Accordion from "./components/Accordion";
// import Alerts from "./components/Alerts";
// import Badges from "./components/Badges";
// import Breadcrumbs from "./components/Breadcrumbs";
// import Buttons from "./components/Buttons";
// import Forms from "./components/Forms";
// import Modals from "./components/Modals";
// import Navs from "./components/Navs";
// import Navbars from "./components/Navbars";
// import Pagination from "./components/Pagination";
// import Popovers from "./components/Popovers";
// import Progress from "./components/Progress";
// import Tables from "./components/Tables";
// import Tabs from "./components/Tabs";
// import Tooltips from "./components/Tooltips";
// import Toasts from "./components/Toasts";

import { RootState } from "../store/store";
import { updateState } from "../store/settings/settingsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import TransactionsOverview from "./TransactionsOverview";
import TransactionDetail from "./TransactionDetail";
import AppDetail from "./AppDetail";

import ContractOptions from "./ContractOptions";
import { BsFillNutFill } from "react-icons/bs";
import FungibleTokenContract from "./contracts/FungibleTokenContract";
import Overview_CashBuy__v1_0_0 from "./AppDetail/CashBuy__v1_0_0/Overview_CashBuy__v1_0_0";
import OverviewAsset from "./AppDetail/AssetDetail/OverviewAsset";
import { Support } from "./documentation/Support";
import { Box } from "./AppDetail/CashBuy__v1_0_0/Box";

const RouteWithLoader = (props: any) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader show={loaded ? false : true} />
      <Outlet />
    </>
  );
};

const RouteWithSidebar = (props: any) => {
  const [loaded, setLoaded] = useState(false);
  const settings = useAppSelector((state: RootState) => state.settings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function loadAlgoSigner() {
      if (typeof (window as any).AlgoSigner !== "undefined") {
        console.log("window.AlgoSigner", (window as any).AlgoSigner);

        try {
          let accounts = await (window as any).AlgoSigner.accounts({
            ledger: settings.selectedAlgorandNetwork,
          });

          dispatch(
            updateState({
              accounts: accounts,
            })
          );
        } catch (e) {}
      } else {
        console.error("NO AlgoSigner");
      }
    }

    async function loadMetamask() {
      if (typeof (window as any).AlgoSigner !== "undefined") {
        console.log("MetaMask is installed!");
        console.log("window.ethereum", (window as any).ethereum);

        try {
          console.log("window.ethereum", (window as any).ethereum);

          let accounts = await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          });

          console.log("accounts", accounts);

          // let accounts = await (window as any).ethereum.accounts({
          //   ledger: settings.selectedNetwork,
          // });

          dispatch(
            updateState({
              accounts: accounts,
            })
          );
        } catch (e) {
          console.error(e);
        }
      } else {
        console.error("NO Metamask");
      }
    }

    switch (settings.selectedBlockchain) {
      case "Ethereum":
        loadMetamask();
        break;
      case "Algorand":
        loadAlgoSigner();
        break;
    }
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem("settingsVisible") === "false"
      ? "false"
      : "true";
  };

  const [showSettings, setShowSettings] = useState<string>(
    localStorageIsSettingsVisible
  );

  const toggleSettings = () => {
    setShowSettings(showSettings ? "false" : "true");
    localStorage.setItem("settingsVisible", showSettings ? "false" : "true");
  };

  return (
    <>
      <Preloader show={loaded ? false : true} />
      <Sidebar />
      <main className="content">
        <Navbar />
        <Outlet />
      </main>
    </>
  );
};

const Router = () => (
  <>
    <Routes>
      <Route path="/" element={<RouteWithLoader />}>
        <Route path={""} element={<Presentation />} />
      </Route>
      {/* <Route
      path={RoutesData.Signin.path}
      element={<RouteWithLoader component={Signin} />}
    />
    <Route
      path={RoutesData.Signup.path}
      element={<RouteWithLoader component={Signup} />}
    />
    <Route
      path={RoutesData.ForgotPassword.path}
      element={<RouteWithLoader component={ForgotPassword} />}
    />
    <Route
      path={RoutesData.ResetPassword.path}
      element={<RouteWithLoader component={ResetPassword} />}
    />
    <Route
      path={RoutesData.Lock.path}
      element={<RouteWithLoader component={Lock} />}
    />
    <Route
      path={RoutesData.NotFound.path}
      element={<RouteWithLoader component={NotFoundPage} />}
    />
    <Route
      path={RoutesData.ServerError.path}
      element={<RouteWithLoader component={ServerError} />}
    /> */}

      {/* pages */}
      <Route path="/dashboard/" element={<RouteWithSidebar />}>
        <Route path={"overview"} element={<BlockchainOverview />} />
        <Route path={"transactions"} element={<TransactionsOverview />} />
        <Route path={"box/:app_id/:box"} element={<Box />} />
        <Route path={"app/"} element={<AppDetail />}>
          <Route
            path={"cashBuy__v1_0_0/:id/"}
            element={<Overview_CashBuy__v1_0_0 />}
          />
          <Route path={"asa/:id"} element={<OverviewAsset />} />
        </Route>
        <Route path={"support"} element={<Support />} />
        <Route path={"contract-options"} element={<ContractOptions />} />
        <Route
          path={"transactions/detail/:id"}
          element={<TransactionDetail />}
        />
        <Route
          path={"new-finance-deal-contract"}
          element={<FinanceDealContract />}
        />
        <Route path={"cash-buy"} element={<CashBuyContract />} />
        <Route
          path={"new-fungible-token-contract"}
          element={<FungibleTokenContract />}
        />
        <Route path={"settings"} element={<Settings />} />
      </Route>
      {/* <Route exact path={RoutesData.DashboardOverview.path} element={<RouteWithSidebar component={DashboardOverview} />} />
    <Route exact path={RoutesData.Upgrade.path} element={<RouteWithSidebar component={Upgrade} />} />
    <Route exact path={RoutesData.Transactions.path} element={<RouteWithSidebar component={Transactions} />} />
    <Route exact path={RoutesData.Settings.path} element={<RouteWithSidebar component={Settings} />} />
    <Route exact path={RoutesData.BootstrapTables.path} element={<RouteWithSidebar component={BootstrapTables} />} /> */}

      {/* components */}
      {/* <RouteWithSidebar exact path={RoutesData.Accordions.path} component={Accordion} />
    <RouteWithSidebar exact path={RoutesData.Alerts.path} component={Alerts} />
    <RouteWithSidebar exact path={RoutesData.Badges.path} component={Badges} />
    <RouteWithSidebar exact path={RoutesData.Breadcrumbs.path} component={Breadcrumbs} />
    <RouteWithSidebar exact path={RoutesData.Buttons.path} component={Buttons} />
    <RouteWithSidebar exact path={RoutesData.Forms.path} component={Forms} />
    <RouteWithSidebar exact path={RoutesData.Modals.path} component={Modals} />
    <RouteWithSidebar exact path={RoutesData.Navs.path} component={Navs} />
    <RouteWithSidebar exact path={RoutesData.Navbars.path} component={Navbars} />
    <RouteWithSidebar exact path={RoutesData.Pagination.path} component={Pagination} />
    <RouteWithSidebar exact path={RoutesData.Popovers.path} component={Popovers} />
    <RouteWithSidebar exact path={RoutesData.Progress.path} component={Progress} />
    <RouteWithSidebar exact path={RoutesData.Tables.path} component={Tables} />
    <RouteWithSidebar exact path={RoutesData.Tabs.path} component={Tabs} />
    <RouteWithSidebar exact path={RoutesData.Tooltips.path} component={Tooltips} />
    <RouteWithSidebar exact path={RoutesData.Toasts.path} component={Toasts} /> */}

      {/* documentation */}
      {/* <RouteWithSidebar exact path={RoutesData.DocsOverview.path} component={DocsOverview} />
    <RouteWithSidebar exact path={RoutesData.DocsDownload.path} component={DocsDownload} />
    <RouteWithSidebar exact path={RoutesData.DocsQuickStart.path} component={DocsQuickStart} />
    <RouteWithSidebar exact path={RoutesData.DocsLicense.path} component={DocsLicense} />
    <RouteWithSidebar exact path={RoutesData.DocsFolderStructure.path} component={DocsFolderStructure} />
    <RouteWithSidebar exact path={RoutesData.DocsBuild.path} component={DocsBuild} />
    <RouteWithSidebar exact path={RoutesData.DocsChangelog.path} component={DocsChangelog} /> */}

      {/* <Navigate to={RoutesData.NotFound.path} /> */}
    </Routes>
    <ToastContainer />
  </>
);

export default Router;
