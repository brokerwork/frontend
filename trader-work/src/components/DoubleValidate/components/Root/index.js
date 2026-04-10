import { PureComponent } from "react";
import "./index.less";
import i18n from "@/utils/i18n";

import { Modal, message, Input } from "antd";
import Button from "@/components/Button";
import ValidateCodeInput from "@/components/ValidateCodeInput";
import _ from "lodash";
const VALIDATE_TYPES = {
  google: "GoogleAuthenticator",
  sms: "SMS"
};
//主题卡片通用组件
export default class DoubleValidate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowTips: false,
      isGoogle: true,
      googleCode: "",
      smsCode: "",
      errorMsg: new Map()
    };
  }
  componentWillReceiveProps(nextprops) {
    if (nextprops.visible && !this.props.visible) {
      const { isGoogleSet, isSmsSet } = this.isValidateSetting(
        nextprops.validateSettingData
      );
      const types = _.get(nextprops.configAcessResult, "twoFAConfig.types", []);
      const isGoogleEnable = types.includes(VALIDATE_TYPES.google);
      const isSmsEnable = types.includes(VALIDATE_TYPES.sms);
      // const { configAcessResult } = this.props;
      // const types = _.get(configAcessResult, "twoFAConfig.types", []);
      // const isGoogleEnable = types.includes(VALIDATE_TYPES.google);
      // const isSmsEnable = types.includes(VALIDATE_TYPES.sms);
      if (isGoogleSet && isGoogleEnable) {
        this.setState({
          isGoogle: true
        });
      } else {
        this.setState({
          isGoogle: false
        });
      }
    }
  }
  componentDidMount() {
    // this.props.getFaData();
    this.props.configAccess();
  }
  showTips = () => {
    this.setState({
      isShowTips: !this.state.isShowTips
    });
  };
  changeValidate = () => {
    this.setState({
      isGoogle: !this.state.isGoogle
    });
  };
  onInputChange = key => e => {
    const v = e.target.value;
    this.setState({
      [key]: v
    });
  };
  //提交验证
  validate = () => {
    const { smsCode, googleCode, isGoogle, errorMap } = this.state;
    const msg = new Map(errorMap);
    if (isGoogle) {
      if (!googleCode) {
        msg.set("googleCode", i18n["double.validate.modal.placeholder"]);
      } else {
        msg.delete("googleCode");
      }
    } else {
      if (!smsCode) {
        msg.set("smsCode", i18n["double.validate.modal.placeholder"]);
      } else {
        msg.delete("smsCode");
      }
    }
    return msg;
  };

  // 验证sms/google
  validateOperate = () => {
    const {
      verifyValidateCode,
      token,
      afterOperate,
      operation,
      closeModal
    } = this.props;
    const { smsCode, googleCode, isGoogle } = this.state;
    const type = isGoogle ? VALIDATE_TYPES.google : VALIDATE_TYPES.sms;
    const verificationCode = isGoogle ? googleCode : smsCode;
    const msg = this.validate(type);
    if (msg.size !== 0) {
      this.setState({
        errorMsg: msg
      });
      return;
    }
    this.setState({
      errorMsg: msg
    });
    //先验证验证码
    const verifyParams = {
      type,
      operation,
      verificationCode
    };
    verifyValidateCode(verifyParams, token).then(res => {
      if (res.result) {
        if (res.data) {
          message.success(i18n["general.success"]);
          closeModal();
          if (afterOperate) {
            afterOperate();
          }
        } else {
          message.error(i18n["general.validate.failed"]);
        }
      }
    });
  };
  isValidateSetting = validateSettingData => {
    const isGoogleSet = validateSettingData.some(
      item => item.type === VALIDATE_TYPES.google
    );
    const isSmsSet = validateSettingData.some(
      item => item.type === VALIDATE_TYPES.sms
    );
    return {
      isGoogleSet,
      isSmsSet
    };
  };
  render() {
    const { isShowTips, isGoogle, googleCode, smsCode, errorMsg } = this.state;
    const {
      token,
      operation,
      validateSettingData,
      visible,
      closeModal,
      configAcessResult
    } = this.props;
    const { isGoogleSet, isSmsSet } = this.isValidateSetting(
      validateSettingData
    );
    const types = _.get(configAcessResult, "twoFAConfig.types", []);
    const isGoogleEnable = types.includes(VALIDATE_TYPES.google);
    const isSmsEnable = types.includes(VALIDATE_TYPES.sms);
    return (
      <Modal closable={false} visible={visible} footer={null} width="360px">
        <div className="double-validate-modal">
          <div className="title">
            <h1>{i18n["double.validate.modal.name"]}</h1>
            {isGoogleEnable && isSmsEnable && isGoogleSet && isSmsSet && (
              <span onClick={this.changeValidate}>
                {
                  i18n[
                    `${
                      isGoogle
                        ? "double.validate.modal.change_sms"
                        : "double.validate.modal.change_google"
                    }`
                  ]
                }
              </span>
            )}
          </div>
          {isGoogleEnable && isGoogle && (
            <div className="content">
              <p>{i18n["double.validate.modal.google.input_tips"]}</p>
              <Input
                className="validate-input"
                placeholder={i18n["double.validate.modal.placeholder"]}
                value={googleCode}
                onChange={this.onInputChange("googleCode")}
              />
              <p className="cannot-get-code" onClick={this.showTips}>
                {i18n["double.validate.modal.canot_get_code"]}
              </p>
              {isShowTips && (
                <p>{i18n["double.validate.modal.canot_get_code.tips"]}</p>
              )}
              {errorMsg.get("googleCode") && (
                <div className="input-error-msg">
                  {errorMsg.get("googleCode")}
                </div>
              )}
            </div>
          )}
          {isSmsEnable && !isGoogle && (
            <div className="content margin-bottom">
              <p>{i18n["double.validate.modal.sms.input_tips"]}</p>
              <ValidateCodeInput
                value={smsCode}
                onChange={this.onInputChange("smsCode")}
                style={{ width: "70%" }}
                token={token}
                operation={operation}
                errorMsg={errorMsg.get("smsCode")}
              />
            </div>
          )}
          <div className="validate-btn">
            <Button type="primary" onClick={this.validateOperate}>
              {i18n["general.button.sure"]}
            </Button>
            <Button className="margin-top" onClick={closeModal}>
              {i18n["general.button.cancel"]}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
