import { Form, Icon, Input, Button } from "antd";
import React from "react";
import { observer } from "mobx-react-lite";
import { withRouter } from "react-router";
const loginForm = observer(props => {
  const {
    form: { getFieldDecorator },
    history: { push }
  } = props;
  const submitLogin = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        push("/home");
      }
    });
  };
  return (
    <div>
      <Form onSubmit={submitLogin}>
        <Form.Item>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="请输入帐号"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input.Password
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="请输入密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            登陆
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});
export default withRouter(loginForm);
