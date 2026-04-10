import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import React from "react";
import { connect } from "react-redux";
import Async from "react-code-splitting";
import { LocaleProvider } from "antd";
import { getProviderType } from "@/utils/language";
import Login from "@/views/Login/login";
import LoginRegister from "@/views/Login/loginRegister";
import RegisterReal from "@/views/Login/registerRealAccount";
import RegisterMock from "@/views/Login/registerMock";
import ForgetPwd from "@/views/Login/forgetPwd";
import { checkToken } from "@/actions/Common/common";
import { TOKEN } from "@/utils/storage";
import Loading from "@/components/Loading";
import CustomNav from "@/views/CustomNav";
// import App from '@/views/App/app'
import Test1 from "@/views/Personal/test1";
const App = props => (
  <Async load={import("../views/App/app")} componentProps={props} />
);
const Spread = ({ beforeChange, ...props }) => (
  <Async
    load={import("../views/Spread").then(beforeChange)}
    componentProps={props}
  />
);
const Personal = ({ beforeChange, ...props }) => (
  <Async
    load={import("../views/Personal").then(beforeChange)}
    componentProps={props}
  />
);
const Account = ({ beforeChange, ...props }) => (
  <Async
    load={import("../views/Account").then(beforeChange)}
    componentProps={props}
  />
);
const Training = ({ beforeChange, ...props }) => (
  <Async
    load={import("../views/Training").then(beforeChange)}
    componentProps={props}
  />
);
const Webcast = ({ beforeChange, ...props }) => (
  <Async
    load={import("../views/Training/webcast").then(beforeChange)}
    componentProps={props}
  />
);
const Related = props => (
  <Async load={import("../views/Related")} componentProps={props} />
);
const Viewpoint = props => (
  <Async load={import("../views/Viewpoint")} componentProps={props} />
);
const Fund = ({ beforeChange, ...props }) => (
  <Async
    load={import("../views/Fund").then(beforeChange)}
    componentProps={props}
  />
);
// const CustomNav = props => (
//   <Async load={import("../views/CustomNav")} componentProps={props} />
// );

class Routes extends React.Component {
  constructor(props) {
    super(props);
  }
  checkToken = () => {
    !!localStorage.getItem(TOKEN) && this.props.checkToken();
  };
  render() {
    const { dispatch, isLogin, ...props } = this.props;
    if (!!localStorage.getItem(TOKEN) && isLogin === null) {
      this.checkToken();
      return <Loading />;
    }
    if (
      !localStorage.getItem(TOKEN) ||
      !isLogin ||
      localStorage.getItem("fromApp")
    ) {
      return (
        <Switch>
          <Route path="/training/live/:videoId" component={Webcast} />
          <Route path="/testdemaxiya(/:cnt)" component={Test1} />
          <Login>
            <Switch>
              <Route path="/login" component={LoginRegister} />
              <Route path="/register" component={LoginRegister} />
              <Route path="/registerReal" component={RegisterReal} />
              <Route path="/registerMock" component={RegisterMock} />
              <Route path="/registerReal" component={RegisterReal} />
              <Route path="/forgetPwd" component={ForgetPwd} />
              <Redirect
                to={{ pathname: "/login", search: props.location.search }}
              />
            </Switch>
          </Login>
        </Switch>
      );
    }
    return (
      <Switch>
        <LocaleProvider locale={getProviderType()}>
          <App {...props}>
            <Switch>
              <Route path="/testdemaxiya(/:cnt)" component={Test1} />
              <Route path="/personal" component={Personal} />
              <Route path="/spread" component={Spread} />
              <Route path="/account" component={Account} />
              <Route path="/training" component={Training} />
              <Route path="/related" component={Related} />
              <Route path="/viewpoint" component={Viewpoint} />
              <Route path="/fund" component={Fund} />
              <Route path="/customer_nav/:menu" component={CustomNav} />
              <Redirect
                to={{
                  pathname: "/personal/overview",
                  search: props.location.search
                }}
              />
            </Switch>
          </App>
        </LocaleProvider>
      </Switch>
    );
  }
}
export default withRouter(
  connect(
    ({ common }) => {
      return {
        isLogin: common.isLogin
      };
    },
    { checkToken }
  )(Routes)
);
