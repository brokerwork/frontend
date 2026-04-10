import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { createBrowserHistory } from "history";

import { configure } from "mobx";

import App from "./App";
import "normalize.css";
import "antd/dist/antd.css";
import "../less/index.css";

import RouterContainer from "./routes";
// import { CommonStore } from "../store/commonStore";
const browserHistory = createBrowserHistory();

// mobx 配置
// configure({
//   enforceActions: "observed" // 开启严格模式
// });
ReactDOM.render(
  <Router history={browserHistory}>
    <App>
      <RouterContainer />
    </App>
  </Router>,
  document.getElementById("root")
);
