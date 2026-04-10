import { PureComponent } from "react";
import "./index.less";
import i18n from "@/utils/i18n";

import { Input } from "antd";

export default class ValidateCodeInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCounttingBtn: false,
      countSecond: 60
    };
  }
  startCounting = () => {
    let second = this.state.countSecond;
    const timer = setInterval(() => {
      if (second <= 0) {
        clearInterval(timer);
        this.setState({
          showCounttingBtn: false,
          countSecond: 60
        });
        return;
      }
      this.setState({
        countSecond: second--
      });
    }, 1000);
  };
  getValidateCode = () => {
    const { sendValidateCode, token, operation } = this.props;
    const params = {
      type: "SMS",
      operation
    };
    sendValidateCode(params, token).then(res => {
      if (res.result) {
        this.setState({
          showCounttingBtn: true
        });
        this.startCounting();
      }
    });
  };
  render() {
    const { showCounttingBtn, countSecond } = this.state;
    const { errorMsg } = this.props;
    return (
      <div>
        <div className="validate-code-box">
          <Input
            placeholder={
              i18n["userInfo.safe.modal.sms.validate_code_placeholder"]
            }
            className="validate-code-input"
            {...this.props}
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
        {errorMsg && <div className="input-error-msg">{errorMsg}</div>}
      </div>
    );
  }
}
