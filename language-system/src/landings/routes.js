import React from "react";
import { Route, Switch } from "react-router-dom";

// import Test from "./components/Test";
import AddInternationalCode from "./AddInternationalCode";
import SearchInternationalCode from "./SearchInternationalCode";
import MutipleLanguageManage from "./MutipleLanguageManage";
import MutipleExportAndImport from "./MutipleExportAndImport";
import Login from "./Login";
import PageWraper from "./components/PageWraper";

const RootRouter = () => {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <PageWraper>
        <Route exact path="/" component={AddInternationalCode} />
        {/* <Route path="/addInternationalCode" component={AddInternationalCode} /> */}
        <Route
          path="/searchInternationalCode"
          component={SearchInternationalCode}
        />
        <Route
          path="/mutipleLanguageManage"
          component={MutipleLanguageManage}
        />
        <Route
          path="/mutipleExportAndImport"
          component={MutipleExportAndImport}
        />
      </PageWraper>
    </Switch>
  );
};

export default RootRouter;
