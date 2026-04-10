import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Tabs, Icon, Button, Form, Input, Row, Col, Checkbox } from "antd";

import i18n from "@/utils/i18n";
import utils from "@/utils/common";
import LoginInput from "./loginInput";
import RegInput from "./registerInput";
import { toJsRegExpMap } from "@/utils/validate";
import * as actions from "@/actions/Login/login";
import { getFaData } from "@/actions/Common/common";
import message from "@/components/Message";
import {
  ls,
  USER_INFO,
  TOKEN,
  LAST_USER_LOGIN_TIME,
  ACCOUNT_DATA
} from "@/utils/storage";
import DoubleValidate from "@/components/DoubleValidate";

import "./loginRegister.less";

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

let loginOldPswd = "";

class LoginRegister extends Component {
  constructor() {
    super();
    this.state = {
      isRegSuc: false, //  是否注册成功
      isUpdatePswd: false, //  登录后是否更新密码
      signupSucessHint: i18n["signup.registerinvite.success"],
      isShowDoubleModal: false,
      loginData: {},
      opt: "",
      token: ""
    };
  }

  //  切换登录、注册
  tabSwitch = v => {
    let registerMock =
      this.props.platforms &&
      this.props.platforms.some(el => {
        return el.enableMockAccountRegister;
      });
    if (v == "1") {
      this.props.history.replace({
        pathname: "/login",
        search: this.props.location.search
      });
    } else if (v == "2") {
      // if(this.props.configAcessResult.registWithOpenAccount||registerMock){
      //     this.props.history.replace({
      //         pathname:'/registerReal',
      //         search:this.props.location.search
      //     })
      // }else{
      this.props.history.replace({
        pathname: "/register",
        search: this.props.location.search
      });
      // }
    }
  };
  //  注册成功[流程更改，该方法废弃]
  // registerSuccess = (type) => {
  //     this.setState({
  //         isUpdatePswd: false,
  //         isRegSuc: true,
  //         signupSucessHint: type == 'email' ? i18n['signup.type.email.activeemailtips'] : i18n['signup.registerinvite.success']
  //     })
  // }
  /**data:接口返回数据；opt登录后操作，, withOpen登录后开真实账户 */
  loginSuccess = (data, opt) => {
    this.setState({
      loginData: data,
      opt,
      token: data.token
    });
    // this.afterLogin(data, opt);
    this.doubleValidate(data, opt);
  };
  //  登录成功后 是否重置了密码
  loginUpdatePswd = oldPswd => {
    loginOldPswd = oldPswd;
    this.setState({
      isRegSuc: false,
      isUpdatePswd: true
    });
  };
  //  跳转登录
  toLogin = () => {
    this.props.history.replace({
      pathname: "/login",
      search: this.props.location.search
    });
    this.setState({
      isRegSuc: false,
      isUpdatePswd: false
    });
  };
  // 二次验证 true,false
  doubleValidate = (data, opt) => {
    const { getFaData, configAcessResult } = this.props;
    // 先验证sc是否有开启验证功能
    if (_.get(configAcessResult, "twoFAConfig.enable", false)) {
      //开启后,先获取fa数据，看用户是否设置了验证方式

      getFaData(data.token).then(res => {
        if (res.result) {
          // 设置了验证方式, 并且验证方式是在sc中启用了的
          const isEnabled = _.get(res, "data", []).some(item =>
            _.get(configAcessResult, "twoFAConfig.types", []).includes(
              item.type
            )
          );
          if (res.data && res.data.length && isEnabled) {
            if (
              _.get(configAcessResult, "twoFAConfig.operation", []).includes(
                "LOGIN"
              )
            ) {
              this.setState({
                isShowDoubleModal: true
              });
            } else {
              this.afterLogin(data, opt);
            }
          } else {
            // 若没有设置验证方式，是否启用了强制验证
            if (
              _.get(
                configAcessResult,
                "twoFAConfig.mandatoryVerification",
                false
              )
            ) {
              this.afterLogin(data, opt);
              // 跳转到安全设置
              window.location.href = "/personal/userinfo?activeTab=3";
            } else {
              //
              this.afterLogin(data, opt);
            }
          }
        }
      });
    } else {
      // 未开启
      this.afterLogin(data, opt);
    }
  };
  // 登录成功后的跳转操作
  afterLogin = (data, opt) => {
    window.postMessage(JSON.stringify(data), "*");
    //  登录成功 缓存用户信息
    localStorage.setItem(TOKEN, data.token);
    const userInfo = {...data}
    delete userInfo.currPwd;
    ls.setItem(USER_INFO, userInfo);
    localStorage.setItem(LAST_USER_LOGIN_TIME, data.lastLoginTime);
    ls.removeItem(ACCOUNT_DATA);
    //  判断用户是否在BW重置过密码
    if (data.pwdReset) {
      this.loginUpdatePswd(data.currPwd);
    } else if (!localStorage.getItem("fromApp")) {
      //判断设备 跳转移动端
      if (
        this.props.modules.indexOf("Mobile Web") !== -1 &&
        navigator.userAgent.match(
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
        )
      ) {
        if (opt == "withOpen") {
          location.replace("/mobile/#/account/overview?opt=fromRegister");
        } else {
          location.replace("/mobile");
        }
      } else if (opt == "withOpen") {
        //根据sc直接跳转到开户页面
        window.location.href = "/account/open?opt=fromRegister";
      } else if (window.location.href.indexOf("redirect") != -1) {
        window.location.href = utils.parseUrlParams().redirect;
      } else {
        window.location.href = "/personal/overview";
      }
    }
  };
  closeDoubleModal = () => {
    this.setState({
      isShowDoubleModal: false
    });
  };
  render() {
    const { configAcessResult, match } = this.props;
    const { isShowDoubleModal, loginData, opt, token } = this.state;
    return (
      <div className="login-reg-wrap">
        {this.state.isRegSuc && (
          <div className="reg-suc-wrap">
            <div className="reg-suc-center">
              <Icon
                type="check-circle-o"
                style={{ fontSize: "45px", color: "#00a871" }}
              />
              <p className="reg-suc-word">{this.state.signupSucessHint}</p>
              <Button onClick={this.toLogin} type="primary" htmlType="submit">
                {i18n["general.gotologin"]}
              </Button>
            </div>
          </div>
        )}
        {!this.state.isRegSuc && !this.state.isUpdatePswd && (
          <Tabs
            activeKey={match.path === "/register" ? "2" : "1"}
            animated={true}
            onTabClick={this.tabSwitch}
          >
            <TabPane tab={i18n["login.submit"]} key="1">
              <LoginInput {...this.props} loginSuccess={this.loginSuccess} />
            </TabPane>
            {configAcessResult && configAcessResult.registrable ? (
              <TabPane tab={i18n["login.register.tw"]} key="2">
                <RegInput {...this.props} loginSuccess={this.loginSuccess} />
              </TabPane>
            ) : null}
          </Tabs>
        )}
        {this.state.isUpdatePswd && <UpdatePswd {...this.props} />}
        <DoubleValidate
          visible={isShowDoubleModal}
          afterOperate={this.afterLogin.bind(this, loginData, opt)}
          token={token}
          operation="LOGIN"
          closeModal={this.closeDoubleModal}
        />
      </div>
    );
  }
}

class UpdatePswdForm extends Component {
  //  提交
  handleSubmit = e => {
    e.preventDefault();
    const { updatePswd } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        updatePswd({
          origin: loginOldPswd,
          newPwd: values.newPswd,
          verified: values.againNewPswd
        }).then(res => {
          if (res.result) {
            message["success"](i18n["password.modify.success"]);
            setTimeout(() => {
              this.toHome();
            }, 900);
          }
        });
      }
    });
  };

  toHome = () => {
    //判断设备 跳转移动端
    if (
      navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      )
    ) {
      location.href = "/mobile";
    } else {
      window.location.href = "/personal/overview";
    }
  };
  //  验证密码一致
  checkPswd = (rule, value, callback) => {
    const { form } = this.props;
    let val = form.getFieldsValue();
    if (val.newPswd !== val.againNewPswd) {
      callback(i18n["password.confirm.errMsg1"]);
    }
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { configAcessResult } = this.props;
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
      <Form onSubmit={this.handleSubmit} className="update-pswd-form">
        <div className="update-pswd-wrap">
          <p className="update-pswd-tit">{i18n["login.update.pswd.tw"]}</p>
          <div className="update-pswd-hint">
            <p className="update-pswd-hint-word">
              <span
                className="iconfont icon-Update_Prompt"
                style={{ color: "#fb4f64" }}
              />
              {i18n["login.update.hint.tw"]}
            </p>
          </div>
        </div>
        <FormItem>
          {getFieldDecorator("newPswd", {
            validateFirst: true,
            rules: [
              {
                required: true,
                message: i18n["forgetpwd.errormsg.newpassword.required"]
              },
              {
                pattern: pswdRegex,
                message: pswdPlaceHolder
              }
            ]
          })(<Input type="password" placeholder={i18n["password.new"]} />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("againNewPswd", {
            validateFirst: true,
            rules: [
              {
                required: true,
                message: i18n["resetpassword.confirmnewpassword.required"]
              },
              {
                pattern: pswdRegex,
                message: pswdPlaceHolder
              },
              {
                validator: this.checkPswd
              }
            ]
          })(
            <Input
              type="password"
              placeholder={i18n["forgetpwdstep3.confirmpwd"]}
            />
          )}
        </FormItem>
        {/* <div className="line"></div> */}

        <div className="btn-wrap">
          <Button onClick={this.toHome} className="no-btn">
            {i18n["login.update.no.change.tw"]}
          </Button>
          <Button className="yes-btn" type="primary" htmlType="submit">
            {i18n["login.update.affirm.change.tw"]}
          </Button>
        </div>
      </Form>
    );
  }
}

const UpdatePswd = Form.create()(UpdatePswdForm);

export default connect(
  ({ login, common }) => {
    return {
      configAcessResult: login.configAcessResult,
      platforms: login.platforms,
      modules: common.modules
    };
  },
  {
    ...actions,
    getFaData
  }
)(LoginRegister);
