import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { RoutesData } from "../routes";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import Transactions from "./Transactions";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    
    <> <Preloader show={loaded ? false : true} /> <Component {...rest} /> </> 
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    // <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...rest} />
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        </main>
      </>
    // )}
    // />
  );
};

const Router = () => (
  <Routes>
    <Route exact path={RoutesData.Presentation.path} element={<RouteWithLoader component={Presentation} />} />
    <Route exact path={RoutesData.Signin.path} element={<RouteWithLoader component={Signin} />} />
    <Route exact path={RoutesData.Signup.path} element={<RouteWithLoader component={Signup} />} />
    <Route exact path={RoutesData.ForgotPassword.path} element={<RouteWithLoader component={ForgotPassword} />} />
    <Route exact path={RoutesData.ResetPassword.path} element={<RouteWithLoader component={ResetPassword} />} />
    <Route exact path={RoutesData.Lock.path} element={<RouteWithLoader component={Lock} />} />
    <Route exact path={RoutesData.NotFound.path} element={<RouteWithLoader component={NotFoundPage} />} />
    <Route exact path={RoutesData.ServerError.path} element={<RouteWithLoader component={ServerError} />} />

    {/* pages */}
    <Route exact path={RoutesData.DashboardOverview.path} element={<RouteWithSidebar component={DashboardOverview} />} />
    <Route exact path={RoutesData.Upgrade.path} element={<RouteWithSidebar component={Upgrade} />} />
    <Route exact path={RoutesData.Transactions.path} element={<RouteWithSidebar component={Transactions} />} />
    <Route exact path={RoutesData.Settings.path} element={<RouteWithSidebar component={Settings} />} />
    <Route exact path={RoutesData.BootstrapTables.path} element={<RouteWithSidebar component={BootstrapTables} />} />

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
);

export default Router