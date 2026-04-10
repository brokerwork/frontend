import React from "react";
import { Form } from "antd";
import LoginForm from "./loginForm";
import cs from "./index.less";
import { observer } from "mobx-react-lite";

const WrappedLoginForm = Form.create({ name: "login_form" })(LoginForm);
const Login = observer(props => {
  return (
    <div className={cs.login_container}>
      <h1 className={cs.login_title}>国际化管理平台</h1>
      <WrappedLoginForm />
    </div>
  );
});

export default Login;
