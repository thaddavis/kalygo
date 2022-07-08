import React from "react";
import ReactDOM from "react-dom/client";

import "./scss/volt.scss";
import "react-datetime/css/react-datetime.css";
import "react-toastify/dist/ReactToastify.css";

import { HashRouter } from "react-router-dom";

import { store } from "./store/store";
import { Provider } from "react-redux";

import ScrollToTop from "./components/ScrollToTop";

import reportWebVitals from "./reportWebVitals";
import Router from "./pages/Router";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <HashRouter>
      <ScrollToTop />
      <Router />
    </HashRouter>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
