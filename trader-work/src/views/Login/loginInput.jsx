import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Checkbox, Button, Alert, Select } from "antd";
import message from "@/components/Message";

import i18n from "@/utils/i18n";
import {
  ls,
  LOGIN_CHECKED,
  REMEMBER_USER_INFO,
  LOGIN_DEFAULT_TYPE
} from "@/utils/storage";
import * as actions from "@/actions/Login/loginInput";
import * as reducers from "@/reducers/Login/loginInput";

import { injectReducer } from "@/utils/injectReducer";
injectReducer("loginInput", reducers);

import popupCaptcha from "@/utils/popupCaptcha";
import PhonePrefix from "@/components/PhonePrefix";
import PasswordInput from "@/components/PasswordInput";
import { phoneRegex, emailRegex } from "@/utils/validate";
import "./loginInput.less";
const FormItem = Form.Item;
const Option = Select.Option;

//  登录Component
class LoginInputForm extends Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      passWord: "",
      checked: ls.getItem(LOGIN_CHECKED),
      isCaptcha: false,
      captchaObj: null, //  滑动验证成功data
      captchaInstance: null, //  滑动验证实例
      isPhoneEmail: localStorage.getItem(LOGIN_DEFAULT_TYPE) != "phone", //  1、true=用户名/邮箱/交易账户 2、false=手机
      defaultLoginType: localStorage.getItem(LOGIN_DEFAULT_TYPE), //  默认登录类型
      loginType: localStorage.getItem(LOGIN_DEFAULT_TYPE) || undefined, //  email: 邮箱登录 phone: 手机登录
      countryCode:
        ls.getItem(LOGIN_CHECKED) &&
        ls.getItem(REMEMBER_USER_INFO) &&
        ls.getItem(REMEMBER_USER_INFO).countryCode
    };
  }
  loginType = "email";
  loginTypes = [
    {
      value: "email",
      label: i18n["login.email.tw"]
    },
    {
      value: "phone",
      label: i18n["login.phone.tw"]
    },
    {
      value: "userName",
      label: i18n["login.user.tw"]
    },
    {
      value: "account",
      label: i18n["login.trader.tw"]
    }
  ];
  //  记住我
  onCheck = e => {
    this.setState({
      checked: e.target.checked
    });
    ls.setItem(LOGIN_CHECKED, e.target.checked);
  };

  //  登录
  handleSubmit = e => {
    e.preventDefault();
    let { loginType = this.loginType } = this.state;
    let { login, loginSuccess } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //  如果为手机登录
        let loginData = {};
        if (!this.state.isPhoneEmail) {
          loginData = {
            countryCode: this.state.countryCode,
            loginName: values.phone.trim(),
            password: values.passWord.trim(),
            loginType: loginType
          };
        } else {
          loginData = {
            loginName: values.userName.trim(),
            password: values.passWord.trim(),
            loginType: loginType
          };
        }
        if (this.captchaInstance) {
          if (!this.captchaObj) {
            return message["error"](i18n["general.captcha.uninitialized"]);
          }
          loginData.neCaptchaDTO = this.captchaObj;
        }

        login(loginData).then(
          res => {
            if (res.result) {
              if (this.state.checked) {
                if (this.state.isPhoneEmail) {
                  ls.setItem(REMEMBER_USER_INFO, {
                    userName: values.userName.trim(),
                    passWord: values.passWord.trim()
                  });
                } else {
                  ls.setItem(REMEMBER_USER_INFO, {
                    countryCode: this.state.countryCode,
                    phone: values.phone.trim(),
                    passWord: values.passWord.trim()
                  });
                }
              } else {
                ls.setItem(REMEMBER_USER_INFO, {});
              }

              loginSuccess(
                { ...res.data, currPwd: values.passWord.trim() },
                "login"
              );
            } else {
              this.loginFailed(res);
            }
          },
          err => {
            this.loginFailed(res);
          }
        );
      }
    });
  };

  //  登录失败
  loginFailed = result => {
    const { configAcessResult } = this.props;
    if (this.captchaInstance) {
      this.captchaObj = null;
      this.captchaInstance.refresh();
      return false;
    }
    if (
      !this.captchaInstance &&
      result.data &&
      result.data.loginFailTimes >= configAcessResult.verificationLoginFailTimes
    ) {
      this.captchaObj = null;
      this.loadCaptcha();
    }
  };

  //  初始化滑动验证
  loadCaptcha = () => {
    this.setState(
      {
        isCaptcha: true
      },
      () => {
        popupCaptcha.init(
          "loginCaptcha",
          (err, data) => {
            if (!err) {
              this.captchaObj = data;
            }
          },
          instance => {
            this.captchaInstance = instance;
          }
        );
      }
    );
  };

  //  申请成为代理
  applyForProxy = () => {
    let url = "";
    let { proxyRegisterable } = this.props.configAcessResult;
    let { customerDomain, productDomain } = this.props.brandInfo;
    if (proxyRegisterable) {
      if (customerDomain) {
        url = `//${customerDomain}/agentApply`;
      } else {
        url = `//${productDomain}/agentApply`;
      }
    }
    location.href = url;
  };

  componentWillReceiveProps(nextProps) {
    const { configAcessResult } = this.props;

    if (nextProps && configAcessResult !== nextProps.configAcessResult) {
      if (nextProps.configAcessResult.verificationLoginFailTimes == 0) {
        this.loadCaptcha();
      }
      const loginTypes = nextProps.configAcessResult.loginConfigs
        .filter(el => el.enable)
        .map(el => {
          return {
            value: this.loginMap[el.loginType].value,
            label: this.loginMap[el.loginType].label
          };
        });
      this.loginTypes = loginTypes;
      if (!this.state.loginType) {
        this.loginType = loginTypes[0] && loginTypes[0].value;
        this.turnPhoneEmail(this.loginType != "phone");
      }
    }
  }

  componentDidMount() {
    const { configAcessResult, form } = this.props;

    if (
      configAcessResult &&
      configAcessResult.verificationLoginFailTimes == 0
    ) {
      this.loadCaptcha();
    }
    //  根据记住我 是否填充登录表单
    if (this.state.checked) {
      let userInfo = ls.getItem(REMEMBER_USER_INFO) || {};
      if (this.state.isPhoneEmail) {
        if (userInfo.userName) {
          form.setFieldsValue({
            userName: userInfo.userName,
            passWord: userInfo.passWord
          });
        }
      } else {
        if (userInfo.phone) {
          form.setFieldsValue({
            phone: userInfo.phone,
            passWord: userInfo.passWord
          });
        }
      }
    }
  }

  turnPhoneEmail = bol => {
    this.setState({
      isPhoneEmail: bol
    });
  };

  onSelect = val => {
    this.setState({
      countryCode: val
    });
  };

  //  选择登录类型
  changeLoginType = val => {
    const { form } = this.props;
    localStorage.setItem(LOGIN_DEFAULT_TYPE, val);
    this.turnPhoneEmail(val != "phone");
    this.setState({
      loginType: val
    });
  };
  loginMap = {
    EMAIL: {
      value: "email",
      label: i18n["login.email.tw"]
    },
    PHONE: {
      value: "phone",
      label: i18n["login.phone.tw"]
    },
    NAME: {
      value: "userName",
      label: i18n["login.user.tw"]
    },
    ACCOUNT: {
      value: "account",
      label: i18n["login.trader.tw"]
    }
  };
  render() {
    const { countryPhone, platforms } = this.props;
    const { getFieldDecorator } = this.props.form;
    let { proxyRegisterable, showFlag } = this.props.configAcessResult;
    let registerMock =
      platforms &&
      platforms.some(el => {
        return el.enableMockAccountRegister;
      });
    let fromApp = window.localStorage.getItem("fromApp");
    let userNamePlaceholder = i18n["login.email"];
    let requiredMessage = i18n["login.email.required"];
    let {
      defaultLoginType,
      isPhoneEmail,
      loginType = this.loginType
    } = this.state;
    if (loginType == "userName") {
      userNamePlaceholder = i18n["tausermgmt.username"];
      requiredMessage = i18n["login.username.required"];
    }
    if (loginType == "account") {
      userNamePlaceholder = i18n["mobile.leverage.account"];
      requiredMessage = i18n["login.trader.required"];
    }

    return (
      <div className="login-input-wrap">
        <Form onSubmit={this.handleSubmit}>
          {/*切换登录类型*/}
          <div className="login-type-wrap" id="login-type-wrap">
            <Select
              getPopupContainer={() =>
                document.getElementById("login-type-wrap")
              }
              onChange={this.changeLoginType}
              value={loginType}
            >
              {this.loginTypes.map(el => {
                return <Option value={el.value}>{el.label}</Option>;
              })}
            </Select>
          </div>
          {isPhoneEmail ? (
            <FormItem>
              {getFieldDecorator("userName", {
                validateFirst: true,
                validateTrigger: "onBlur",
                rules: [
                  {
                    required: true,
                    message: requiredMessage
                  },
                  {
                    pattern: loginType == "email" ? emailRegex : null,
                    message: i18n["forgetpwd.errormsg.email.invalid"]
                  }
                ]
              })(<Input placeholder={userNamePlaceholder} />)}
            </FormItem>
          ) : (
            <FormItem>
              {getFieldDecorator("phone", {
                validateFirst: true,
                validateTrigger: "onBlur",
                rules: [
                  {
                    required: true,
                    message: i18n["signup.errormsg.mobile.required"]
                  },
                  {
                    pattern: phoneRegex,
                    message: i18n["signup.errormsg.mobile.invalid"]
                  }
                ]
              })(
                <Input
                  addonBefore={
                    <PhonePrefix
                      defaultValue={this.state.countryCode}
                      onSelect={this.onSelect}
                      countryPhone={countryPhone}
                      showFlag={showFlag}
                    />
                  }
                  placeholder={i18n["signup.mobile"]}
                />
              )}
            </FormItem>
          )}
          <FormItem>
            {getFieldDecorator("passWord", {
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: i18n["login.errormsg.password.required"]
                }
              ]
            })(<PasswordInput placeholder={i18n["login.password.tw"]} />)}
          </FormItem>
          {this.state.isCaptcha ? (
            <div id="loginCaptcha" style={{ margin: "20px 0" }}></div>
          ) : null}
          <div className="login-action-wrap wrap-center">
            <Checkbox onChange={this.onCheck} checked={this.state.checked}>
              {i18n["login.rememberme"]}
            </Checkbox>
            <span
              onClick={() => {
                this.props.history.push("/forgetPwd");
              }}
              className="login-form-forget cursor right"
            >
              {i18n["menu.forget.password"]}?
            </span>
          </div>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {i18n["overview.account.login"]}
            </Button>
          </FormItem>
          <div className="login-action-wrap wrap-border">
            <Checkbox onChange={this.onCheck} checked={this.state.checked}>
              {i18n["login.rememberme"]}
            </Checkbox>
            <span
              onClick={() => {
                this.props.history.push("/forgetPwd");
              }}
              className="login-form-forget cursor right"
            >
              {i18n["menu.forget.password"]}?
            </span>
          </div>
        </Form>
        {(registerMock || proxyRegisterable) && !fromApp ? (
          <div>
            <div className="login-input-line flex-center">
              <span className="login-line"></span>
              <span className="login-other">{i18n["transfer.other"]}</span>
              <span className="login-line"></span>
            </div>
            <div className="login-input-bottom cursor">
              {registerMock ? (
                <span
                  onClick={() => {
                    this.props.history.push({
                      pathname: "/registerMock",
                      search: this.props.location.search
                    });
                  }}
                >
                  {i18n["fastSignup.register.demo"]}
                </span>
              ) : null}
              {registerMock && proxyRegisterable ? (
                <i className="dian"></i>
              ) : null}
              {proxyRegisterable ? (
                <span onClick={this.applyForProxy}>
                  {i18n["login.apply.proxy"]}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

const LoginInput = Form.create()(LoginInputForm);

export default connect(
  ({ common, login, loginInput }) => {
    return {
      configAcessResult: login.configAcessResult,
      brandInfo: loginInput.loginResult,
      modules: common.modules,
      platforms: login.platforms,
      brandInfo: loginInput.loginResult,
      countryPhone: common.countryPhone
    };
  },
  {
    ...actions
  }
)(LoginInput);
