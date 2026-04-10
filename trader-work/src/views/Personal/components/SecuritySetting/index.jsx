import React, { Component } from "react";
import i18n from "@/utils/i18n";
import { Modal, message } from "antd";
import "../../userInfo.less";
import Button from "@/components/Button";
import DoubleValidate from "@/components/DoubleValidate";

import iPhone from "@/images/iphone.png";
import Andriod from "@/images/andriod.png";
import Msg from "@/images/message.png";
import GoogleValidate from "../GoogleValidate";
import SmsValidate from "../SmsValidate";
import { ls } from "@/utils/storage";
import _ from "lodash";
const VALIDATE_TYPES = {
  google: "GoogleAuthenticator",
  sms: "SMS"
};
// const userPhone = ls.getItem("USER_INFO").phone;
const { confirm } = Modal;

export default class SecuritySetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleValidateModal: false,
      smsValidateModal: false,
      googleActionType: "add", // add, delete
      smsActionType: "add", // add, delete
      secretValue: "",
      codeValue: "",
      errorMsg: new Map()
    };
  }
  showModal = (modal, boolean) => {
    this.setState({
      [modal]: boolean
    });
  };
  // 开启Modal
  openModal = (modal, action) => {
    const {
      configAcessResult,
      validateSettingData,
      onTabChange,
      userPhone,
      accountInfo
    } = this.props;
    if (modal === "smsValidateModal" && !userPhone) {
      // message.info(i18n["userInfo.safe.modal.sms.set_phone"]);
      // return;
      confirm({
        title: i18n["sameaccount.tip"],
        content: i18n["userInfo.safe.modal.sms.set_phone"],
        onOk() {
          return onTabChange("1");
        },
        onCancel() {}
      });
      return;
    }
    const actionType =
      modal === "smsValidateModal" ? "smsActionType" : "googleActionType";
    this.setState({
      [modal]: true,
      [actionType]: action
    });
  };
  // 提交验证
  validate = type => {
    const { codeValue, secretValue, errorMap } = this.state;
    const msg = new Map(errorMap);
    // 必填验证
    if (type === VALIDATE_TYPES.sms) {
      if (!codeValue) {
        msg.set("codeValue", i18n["double.validate.modal.placeholder"]);
      } else {
        msg.delete("codeValue");
      }
    }
    if (type === VALIDATE_TYPES.google) {
      if (!secretValue) {
        msg.set("secretValue", i18n["double.validate.modal.placeholder"]);
      } else {
        msg.delete("secretValue");
      }
    }
    return msg;
  };
  validateOperation = (type, action) => {
    const {
      setFaSetting,
      cancelFaSetting,
      verifyValidateCode,
      getFaData,
      googleValidate
    } = this.props;
    const { codeValue, secretValue } = this.state;
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
    // // goole开启的时候不verify 关闭的时候需要verify, sms开启关闭都需要verify
    // if (type === VALIDATE_TYPES.google && action === "add") {
    //   const params = {
    //     type,
    //     detail: {
    //       secret: secretValue
    //     }
    //   };
    //   setFaSetting(params).then(res => {
    //     if (res.result) {
    //       message.success(i18n["general.success"]);
    //       this.showModal("googleValidateModal", false);
    //       getFaData();
    //     }
    //   });
    //   return;
    // }
    //先验证验证码
    const verifyParams = {
      type,
      operation: action === "add" ? "ENABLE_2FA" : "DISABLE_2FA",
      verificationCode: type === VALIDATE_TYPES.sms ? codeValue : secretValue
    };
    if (type === VALIDATE_TYPES.google && action === "add") {
      verifyParams.secret = googleValidate.secret;
    }

    verifyValidateCode(verifyParams).then(res => {
      if (res.result) {
        if (res.data) {
          const params =
            action === "delete" || type === VALIDATE_TYPES.sms
              ? {
                  type
                }
              : {
                  type,
                  detail: {
                    secret: googleValidate.secret
                  }
                };
          const operate = action === "add" ? setFaSetting : cancelFaSetting;
          operate(params).then(re => {
            if (re.result) {
              message.success(i18n["general.success"]);
              this.showModal(
                type === VALIDATE_TYPES.sms
                  ? "smsValidateModal"
                  : "googleValidateModal",
                false
              );
              getFaData();
            }
          });
        } else {
          message.error(i18n["general.validate.failed"]);
        }
      }
    });
  };
  // 验证google
  validateGoogle = action => {
    const { setFaSetting, cancelFaSetting } = this.props;
    const { secretValue } = this.state;
    const params = {
      type: VALIDATE_TYPES.google,
      detail: {
        secret: secretValue
      }
    };

    const operate = action === "add" ? setFaSetting : cancelFaSetting;
    operate(params).then(res => {
      if (res.result) {
        message.success(i18n["general.success"]);
        this.showModal("googleValidateModal", false);
      }
    });
  };
  getSecretValue = value => {
    this.setState({
      secretValue: value
    });
  };
  onCodeChange = e => {
    const v = e.target.value;
    this.setState({
      codeValue: v
    });
  };
  render() {
    const {
      googleValidateModal,
      smsValidateModal,
      googleActionType,
      smsActionType,
      codeValue,
      errorMsg
    } = this.state;
    const {
      validateSettingData,
      googleValidate,
      sendValidateCode,
      configAcessResult,
      userPhone,
      accountInfo
    } = this.props;
    const isGoogleEnabled = validateSettingData.some(
      item => item.type === VALIDATE_TYPES.google
    );
    const isSmsEnabled = validateSettingData.some(
      item => item.type === VALIDATE_TYPES.sms
    );
    const types = _.get(configAcessResult, "twoFAConfig.types", []);
    const isShowGoogle = types.some(item => item === VALIDATE_TYPES.google);
    const isShowSms = types.some(item => item === VALIDATE_TYPES.sms);

    return (
      <div className="security-setting">
        <h1>{i18n["userInfo.safe.title"]}</h1>
        <p className="validate_content">{i18n["userInfo.safe.expalin"]}</p>
        <p className="validate_content">{i18n["userInfo.safe.sensitive"]}</p>
        <div>
          {isShowGoogle && (
            <div className="security-setting-item">
              <div class="security-setting-title">
                <h2>{i18n["userInfo.safe.google"]}</h2>
                {isGoogleEnabled ? (
                  <span className="security-setting-btn active">
                    {i18n["userInfo.safe.enabled"]}
                  </span>
                ) : (
                  <span className="security-setting-btn">
                    {i18n["userInfo.safe.disabled"]}
                  </span>
                )}
              </div>
              <div className="userInfo-setting-phone">
                <div className="userInfo-setting-phone-item">
                  <img src={Andriod} alt="" />
                  <div className="content">
                    <h3>{i18n["userInfo.safe.andriod"]}</h3>
                    <p>{i18n["userInfo.safe.andriod.desc"]}</p>
                  </div>
                </div>
                <span class="split" />
                <div className="userInfo-setting-phone-item">
                  <img src={iPhone} alt="" />
                  <div className="content">
                    <h3>{i18n["userInfo.safe.iphone"]}</h3>
                    <p>{i18n["userInfo.safe.iphone.desc"]}</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={this.openModal.bind(
                  this,
                  "googleValidateModal",
                  isGoogleEnabled ? "delete" : "add"
                )}
                type={isGoogleEnabled ? "default" : "primary"}
              >
                {
                  i18n[
                    `${
                      isGoogleEnabled
                        ? "userInfo.safe.click.disabled"
                        : "userInfo.safe.click.enabled"
                    }`
                  ]
                }
              </Button>
            </div>
          )}
        </div>
        <div>
          {isShowSms && (
            <div className="security-setting-item">
              <div class="security-setting-title">
                <h2>{i18n["userInfo.safe.message"]}</h2>
                {isSmsEnabled ? (
                  <span className="security-setting-btn active">
                    {i18n["userInfo.safe.enabled"]}
                  </span>
                ) : (
                  <span className="security-setting-btn">
                    {i18n["userInfo.safe.disabled"]}
                  </span>
                )}
              </div>
              <div className="userInfo-setting-phone">
                <div className="userInfo-setting-phone-item">
                  <img src={Msg} alt="" />
                  <div className="content">
                    <h3>{i18n["userInfo.safe.send.message"]}</h3>
                    <p>{i18n["userInfo.safe.message.desc"]}</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={this.openModal.bind(
                  this,
                  "smsValidateModal",
                  isSmsEnabled ? "delete" : "add"
                )}
                type={isSmsEnabled ? "default" : "primary"}
              >
                {
                  i18n[
                    `${
                      isSmsEnabled
                        ? "userInfo.safe.click.disabled"
                        : "userInfo.safe.click.enabled"
                    }`
                  ]
                }
              </Button>
            </div>
          )}
        </div>
        {/* 验证google */}
        <Modal
          closable={false}
          visible={googleValidateModal}
          footer={[
            <Button
              onClick={this.showModal.bind(this, "googleValidateModal", false)}
            >
              {i18n["general.button.cancel"]}
            </Button>,
            <Button
              type="primary"
              onClick={this.validateOperation.bind(
                this,
                VALIDATE_TYPES.google,
                googleActionType
              )}
            >
              {
                i18n[
                  `${
                    googleActionType === "add"
                      ? "userInfo.safe.modal.confirm"
                      : "userInfo.safe.modal.close"
                  }`
                ]
              }
            </Button>
          ]}
          getContainer={() => document.getElementById("userInfo")}
          title={i18n["userInfo.safe.modal.google.title"]}
        >
          <GoogleValidate
            data={googleValidate}
            getSecretValue={this.getSecretValue}
            errorMsg={errorMsg}
            actionType={googleActionType}
          />
        </Modal>
        {/* 短信验证 */}
        <Modal
          closable={false}
          visible={smsValidateModal}
          footer={[
            <Button
              onClick={this.showModal.bind(this, "smsValidateModal", false)}
            >
              {i18n["general.button.cancel"]}
            </Button>,
            <Button
              type="primary"
              onClick={this.validateOperation.bind(
                this,
                VALIDATE_TYPES.sms,
                smsActionType
              )}
            >
              {
                i18n[
                  `${
                    smsActionType === "add"
                      ? "userInfo.safe.modal.confirm"
                      : "userInfo.safe.modal.close"
                  }`
                ]
              }
            </Button>
          ]}
          getContainer={() => document.getElementById("userInfo")}
          title={i18n["userInfo.safe.modal.sms.title"]}
        >
          <SmsValidate
            userPhone={userPhone}
            sendValidateCode={sendValidateCode}
            onChange={this.onCodeChange}
            codeValue={codeValue}
            operation={smsActionType === "add" ? "ENABLE_2FA" : "DISABLE_2FA"}
            errorMsg={errorMsg}
            accountInfo={accountInfo}
          />
        </Modal>
        <DoubleValidate />
      </div>
    );
  }
}
