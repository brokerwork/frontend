import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Form,
  Tabs,
  Input,
  Checkbox,
  Button,
  Icon,
  Row,
  Col,
  Alert
} from "antd";
import message from "@/components/Message";

import i18n from "@/utils/i18n";
import { COUNTRY_CODE_KEY } from "@/utils/country";
import * as actions from "@/actions/Login/registerInput";
import * as loginActions from "@/actions/Login/login";
import * as reducers from "@/reducers/Login/registerInput";

import utils from "@/utils/common";
import { injectReducer } from "@/utils/injectReducer";
injectReducer("registerInput", reducers);

import popupCaptcha from "@/utils/popupCaptcha";
import PhonePrefix from "@/components/PhonePrefix";
import PasswordInput from "@/components/PasswordInput";
import { emailRegex, phoneRegex, toJsRegExpMap } from "@/utils/validate";
import "./registerInput.less";

const FormItem = Form.Item;

const iconStyle = {
  color: "#00a8a6"
};
// 注册Component
class RegInputForm extends Component {
  constructor() {
    super();
    this.state = {
      isCaptcha: false,
      captchaButton: i18n["signup.getverifycode"], //  获取验证码按钮文字
      captchaTime: 0, //  获取验证码倒计时
      disabledBtn: false, //  获取验证码按钮disable
      countryCode: "+86",
      pid: utils.parseUrlParams().pid,
      iid: utils.parseUrlParams().iid,
      uid: utils.parseUrlParams().uid,
      email: utils.parseUrlParams().email,
      customerId: utils.parseUrlParams().customerId,
      cid: utils.parseUrlParams().cid,
      t: utils.parseUrlParams().token,
      showCap: false
    };
    this.handleSubmit = _.throttle(this.handleSubmit, 1000, {
      trailing: false
    });
  }

  //  手机、邮箱切换
  turnPhoneEmail = type => {
    this.captchaObj = null;
    this.setState({
      isCaptcha: false
    });
    this.props.updateConfigAccess(type);
    if (this.captchaInstance) {
      this.captchaInstance.refresh();
    }
  };

  //  提交表单
  handleSubmit = (e, opt) => {
    //opt=withOpen,注册并开户
    e.preventDefault();
    let { registerMail, registerPhone, configAcessResult } = this.props;
    const { customerId, t } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (
          !this.state.showCap ||
          (this.captchaObj && this.captchaObj.validate)
        ) {
          let params = {
            pid: values.regCode,
            uid: this.state.uid,
            customSource: this.state.iid,
            password: values.regPsWd.trim(),
            // neCaptchaDTO: this.captchaObj,//修改流程后，注册只需要依据用户收到的验证码（手机或邮箱）
            realname: values.userName.trim()
          };
          if (customerId && t) {
            this.invitRegisterEmail(params, values, opt);
          } else {
            this.registerFuc(params, values, opt);
          }
        } else {
          return message["error"](i18n["general.captcha.uninitialized"]);
        }
      }
    });
  };

  //  推荐邮箱注册
  invitRegisterEmail = (params, values, opt) => {
    const { loginSuccess, invitRegisterEmail } = this.props;
    const { customerId, t, email } = this.state;
    Object.assign(params, { mail: email, customerId: customerId, t: t });
    invitRegisterEmail(params).then(
      res => {
        if (res.result) {
          loginSuccess(res.data, opt);
        } else {
          this.captchaObj = null;
          this.setState({
            isCaptcha: false
          });
          this.captchaInstance.refresh();
        }
      },
      err => {
        this.captchaObj = null;
        this.setState({
          isCaptcha: false
        });
        this.captchaInstance.refresh();
      }
    );
  };

  //  邮箱、手机注册
  registerFuc = (params, values, opt) => {
    const {
      registerMail,
      registerPhone,
      configAcessResult,
      loginSuccess
    } = this.props;
    if (
      configAcessResult &&
      configAcessResult.defaultRegisterMethod === "email"
    ) {
      Object.assign(params, {
        mail: values.regEmail.trim(),
        mailCaptcha: values.phoneCaptcha.trim(),
        cid: this.state.cid,
        neCaptchaDTO: this.captchaObj
      });
      registerMail(params, this.state.showCap).then(
        res => {
          if (res.result) {
            loginSuccess(res.data, opt);
          } else {
            this.captchaObj = null;
            this.setState({
              isCaptcha: false
            });
            this.captchaInstance.refresh();
          }
        },
        err => {
          this.captchaObj = null;
          this.setState({
            isCaptcha: false
          });
          this.captchaInstance.refresh();
        }
      );
    } else {
      Object.assign(params, {
        phone: values.regPhone.trim(),
        countryCode: this.state.countryCode,
        phoneCaptcha: values.phoneCaptcha.trim(),
        cid: this.state.cid
      });
      registerPhone(params).then(
        res => {
          if (res.result) {
            loginSuccess(res.data, opt);
          } else {
            this.captchaObj = null;
            this.setState({
              isCaptcha: false
            });
            this.captchaInstance.refresh();
          }
        },
        err => {
          this.captchaObj = null;
          this.setState({
            isCaptcha: false
          });
          this.captchaInstance.refresh();
        }
      );
    }
  };
  /**原功能为获取手机号验证码，邮箱注册改为也发送验证码后，注册流程与手机注册一样。当前功能为获取手机或者邮箱验证码 */
  getPhoneCaptcha = () => {
    const type = this.props.configAcessResult.defaultRegisterMethod; //phone or email
    let curPhone = this.props.form.getFieldValue("regPhone");
    let curEmail = this.props.form.getFieldValue("regEmail");
    if (type == "phone") {
      if (!curPhone) {
        return this.props.form.setFields({
          regPhone: {
            value: curPhone,
            errors: [new Error(i18n["signup.errormsg.mobile.required"])]
          }
        });
      } else if (!phoneRegex.test(curPhone)) {
        return this.props.form.setFields({
          regPhone: {
            value: curPhone,
            errors: [new Error(i18n["signup.errormsg.mobile.invalid"])]
          }
        });
      }
    } else if (type == "email") {
      if (!curEmail) {
        return this.props.form.setFields({
          regEmail: {
            value: curEmail,
            errors: [new Error(i18n["signup.errormsg.email.required"])]
          }
        });
      } else if (!emailRegex.test(curEmail)) {
        return this.props.form.setFields({
          regEmail: {
            value: curEmail,
            errors: [new Error(i18n["signup.errormsg.email.invalid"])]
          }
        });
      }
    }
    const sendCallback = result => {
      if (result) {
        //  获取验证码倒计时
        let sec = 60;
        this.setState(
          {
            captchaTime: sec,
            captchaButton: i18n["general.resend"],
            disabledBtn: true
          },
          () => {
            let timer = setInterval(() => {
              this.setState({
                captchaTime: --sec
              });
              if (sec <= 0) {
                sec = 0;
                this.setState({
                  captchaTime: sec,
                  captchaButton: i18n["signup.getverifycode"],
                  disabledBtn: false
                });
                clearInterval(timer);
              }
            }, 1000);
          }
        );
      } else {
        this.captchaObj = null;
        this.setState({
          isCaptcha: false
        });
        this.captchaInstance.refresh();
      }
    };
    if (type == "phone") {
      this.props
        .phoneValidate(
          curPhone,
          this.state.countryCode,
          this.state.showCap,
          this.captchaObj
        )
        .then(res => {
          sendCallback(res.result);
        });
    } else if (type == "email") {
      this.props.emailValidate(curEmail, this.captchaObj).then(res => {
        sendCallback(res.result);
      });
    }
  };

  componentDidMount() {
    const { email } = this.state;
    const { form } = this.props;
    //  如果url参数带有email 则切换为邮箱注册 并赋值
    if (email) {
      this.turnPhoneEmail("email");
    }
    const _c = this.props.configAcessResult;
    this.setState({
      showCap:
        (_c.defaultRegisterMethod == "email" && _c.emailSlideVerify) ||
        (_c.defaultRegisterMethod == "phone" && _c.phoneSlideVerify)
    });
    this.renderCaptcha();
  }
  componentDidUpdate() {
    const { email } = this.state;
    const { form, configAcessResult } = this.props;
    if (
      email &&
      !form.getFieldValue("regEmail") &&
      configAcessResult &&
      configAcessResult.defaultRegisterMethod === "email"
    ) {
      form.setFieldsValue({
        regEmail: email
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const _c = nextProps.configAcessResult;
    this.setState({
      showCap:
        (_c.defaultRegisterMethod == "email" && _c.emailSlideVerify) ||
        (_c.defaultRegisterMethod == "phone" && _c.phoneSlideVerify)
    });
  }
  renderCaptcha = () => {
    //  滑动验证
    popupCaptcha.init(
      "regCaptcha",
      (err, data) => {
        if (!err) {
          this.captchaObj = data;
          this.setState({
            isCaptcha: true
          });
        }
      },
      instance => {
        this.captchaInstance = instance;
      }
    );
  };

  onSelect = val => {
    this.setState({
      countryCode: val
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { configAcessResult, countryPhone, brandInfo } = this.props;
    let pwdStrength = "";
    let pswdRegex = new RegExp();
    let pswdPlaceHolder = "";
    if (configAcessResult) {
      pwdStrength = configAcessResult.pwdStrength;
      pswdRegex = toJsRegExpMap(configAcessResult.pwdRegexMap)[pwdStrength];

      if (pwdStrength == "Middle") {
        pswdPlaceHolder = i18n["general.password.middle.invalid"];
      } else if (pwdStrength == "Strong") {
        pswdPlaceHolder = i18n["general.password.strong.invalid"];
      } else if (pwdStrength == "SuperStrong") {
        pswdPlaceHolder = i18n["general.password.superstrong.invalid"];
      }
    }
    return (
      <div className="reg-input-wrap">
        <Form onSubmit={this.handleSubmit}>
          {configAcessResult &&
          configAcessResult.defaultRegisterMethod === "email" ? (
            <div className="reg-input-turn">
              <span className="reg-input-way cursor">
                {i18n["signup.type.email"]}
              </span>
              {configAcessResult && configAcessResult.allowPhone && (
                <a
                  onClick={this.turnPhoneEmail.bind(this, "phone")}
                  className="reg-input-phone-email right"
                >
                  <span className="iconfont icon-register_mobile"></span>
                  <span>{i18n["signup.type.switchEmail.tw"]}</span>
                </a>
              )}
            </div>
          ) : (
            <div className="reg-input-turn">
              <span className="reg-input-way">
                {i18n["signup.type.mobile"]}
              </span>
              {configAcessResult && configAcessResult.allowEmail && (
                <a
                  onClick={this.turnPhoneEmail.bind(this, "email")}
                  className="reg-input-phone-email right"
                >
                  <span className="iconfont icon-register_email"></span>
                  <span>{i18n["signup.type.switchPhone.tw"]}</span>
                </a>
              )}
            </div>
          )}
          {configAcessResult &&
          configAcessResult.defaultRegisterMethod === "email" ? (
            <FormItem>
              {getFieldDecorator("regEmail", {
                validateFirst: true,
                validateTrigger: "onBlur",
                rules: [
                  {
                    required: true,
                    message: i18n["signup.errormsg.email.required"]
                  },
                  {
                    pattern: emailRegex,
                    message: i18n["signup.errormsg.email.invalid"]
                  }
                ]
              })(
                <Input
                  disabled={!!this.state.email}
                  placeholder={i18n["signup.email"]}
                />
              )}
            </FormItem>
          ) : (
            <FormItem className="reg-input-phone-input">
              {getFieldDecorator("regPhone", {
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
                      onSelect={this.onSelect}
                      countryPhone={countryPhone}
                      showFlag={configAcessResult.showFlag}
                    />
                  }
                  placeholder={i18n["signup.mobile"]}
                />
              )}
            </FormItem>
          )}
          <FormItem>
            {getFieldDecorator("userName", {
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: i18n["signup.errormsg.realname.required"]
                }
              ]
            })(<Input placeholder={i18n["signup.realname"]} />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator("regPsWd", {
              validateFirst: true,
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: i18n["signup.errormsg.password.required"]
                },
                {
                  pattern: pswdRegex,
                  message: pswdPlaceHolder
                }
              ]
            })(<PasswordInput placeholder={pswdPlaceHolder} />)}
          </FormItem>
          {brandInfo && brandInfo.remCodeShow && !this.state.cid ? (
            <FormItem>
              {getFieldDecorator("regCode", {
                initialValue: this.state.pid,
                rules: [
                  {
                    required: brandInfo.remCodeRequired,
                    message: i18n["login.trader.required.regcode"]
                  }
                ]
              })(
                <Input
                  disabled={this.state.pid}
                  placeholder={i18n["signup.recommandcode"]}
                />
              )}
            </FormItem>
          ) : null}
          <FormItem style={this.state.showCap ? null : { display: "none" }}>
            <div id="regCaptcha"></div>
          </FormItem>
          {(!this.state.showCap || this.state.isCaptcha) &&
          !this.state.email ? (
            <FormItem className="verifycode-warp">
              <Row gutter={10}>
                <Col span={15}>
                  {getFieldDecorator("phoneCaptcha", {
                    rules: [
                      {
                        required: true,
                        message: i18n["signup.errormsg.verifycode.required"]
                      }
                    ]
                  })(
                    <Input
                      size="large"
                      placeholder={i18n["signup.errormsg.verifycode.required"]}
                    />
                  )}
                </Col>
                <Col span={9} className="reg-input-captcha-btn">
                  <Button
                    disabled={this.state.disabledBtn}
                    onClick={this.getPhoneCaptcha}
                    size="large"
                  >
                    {this.state.captchaTime ? this.state.captchaTime : null}
                    {this.state.captchaButton}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          ) : null}
          {configAcessResult && configAcessResult.registWithOpenAccount ? (
            <FormItem style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                onClick={e => this.handleSubmit(e, "withOpen")}
              >
                {i18n["signup.register.openAcount"]}
              </Button>
              {configAcessResult.registerOnly && (
                <a
                  className="reg-only-btn"
                  htmlType="submit"
                  onClick={this.handleSubmit}
                >
                  {i18n["signup.register.only"]}
                </a>
              )}
            </FormItem>
          ) : (
            <FormItem style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                {i18n["signup.register"]}
              </Button>
            </FormItem>
          )}
        </Form>
      </div>
    );
  }
}

const RegInput = Form.create()(RegInputForm);

export default connect(
  ({ common, registerInput, login }) => {
    return {
      configAcessResult: login.configAcessResult,
      countryPhone: common.countryPhone,
      brandInfo: common.brandInfo
    };
  },
  {
    ...actions,
    ...loginActions
  }
)(RegInput);
