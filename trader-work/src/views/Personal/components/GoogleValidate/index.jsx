import React, { Component } from "react";
import i18n from "@/utils/i18n";
import { Input } from "antd";
import "./index.less";

export default class GoogleValidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secret: ""
    };
  }
  onChange = e => {
    const v = e.target.value;
    this.setState({
      secret: v
    });
    this.props.getSecretValue(v);
  };
  render() {
    const { data, errorMsg, actionType } = this.props;
    return (
      <div className="google-validate-modal">
        {actionType === "add" ? (
          <div>
            <p>{i18n["userInfo.safe.modal.google.content.one"]}</p>
            <img className="qr-img" src={data.qrCode} alt="" />
            <p className="input-key">
              {i18n["userInfo.safe.modal.google.content.one.or"]}
            </p>
            <p>{data.secret}</p>
            <p className="color-red">
              {i18n["userInfo.safe.modal.google.content.one.notice"]}
            </p>
            <p>{i18n["userInfo.safe.modal.google.content.two"]}</p>
          </div>
        ) : (
          <p>{i18n["userInfo.safe.modal.google.content.delete"]}</p>
        )}
        <Input
          value={this.state.secret}
          onChange={this.onChange}
          maxLength={6}
        />
        {errorMsg.get("secretValue") && (
          <div className="input-error-msg">{errorMsg.get("secretValue")}</div>
        )}
      </div>
    );
  }
}
