import React, { Component } from "react";
import i18n from "@/utils/i18n";
import { Input } from "antd";
import "./index.less";

export default class SmsValidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCounttingBtn: false,
      countSecond: 60
    };
  }
  getValidateCode = () => {
    const { sendValidateCode, operation } = this.props;
    const params = {
      type: "SMS",
      operation
    };
    sendValidateCode(params).then(res => {
      if (res.result) {
        this.setState({
          showCounttingBtn: true
        });
        this.startCounting();
      }
    });
  };
  startCounting = () => {
    let second = 60;
    const timer = setInterval(() => {
      if (second <= 0) {
        this.setState({
          showCounttingBtn: false,
          countSecond: 60
        });
        clearInterval(timer);
        return;
      }
      this.setState({
        countSecond: second--
      });
    }, 1000);
  };
  render() {
    const {
      userPhone,
      sendValidateCode,
      codeValue,
      onChange,
      errorMsg,
      accountInfo
    } = this.props;
    const { showCounttingBtn, countSecond } = this.state;
    return (
      <div className="sms-validate-modal">
        <p>{i18n["userInfo.safe.modal.sms.phone"]}</p>
        <Input
          addonBefore={accountInfo.countryCode}
          disabled
          value={userPhone}
        />
        <div className="validate-code-box">
          <Input
            placeholder={
              i18n["userInfo.safe.modal.sms.validate_code_placeholder"]
            }
            style={{ width: "80%" }}
            className="validate-code-input"
            value={codeValue}
            onChange={onChange}
          />
          {showCounttingBtn ? (
            <span className="validate-code-btn validate-code-input-disabled">
              {countSecond}s
            </span>
          ) : (
            <span className="validate-code-btn" onClick={this.getValidateCode}>
              {i18n["userInfo.safe.modal.sms.validate_code"]}
            </span>
          )}
        </div>
        {errorMsg.get("codeValue") && (
          <div className="input-error-msg">{errorMsg.get("codeValue")}</div>
        )}
      </div>
    );
  }
}
