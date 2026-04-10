import React, { Component } from "react";
import {
  Input,
  Form,
  Row,
  Col,
  Icon,
  Select,
  Checkbox,
  Divider,
  Modal
} from "antd";

import "./userInfo.less";
import i18n from "@/utils/i18n";
import Button from "@/components/Button";
import Message from "@/components/Message";
import { toJsRegExpMap } from "@/utils/validate";
import PhonePrefix from "@/components/PhonePrefix";
import { getTypeCountryCode } from "@/utils/language";
import { phoneRegex, emailRegex } from "@/utils/validate";
import { ls, REMEMBER_USER_INFO } from "@/utils/storage";
import DoubleValidate from "@/components/DoubleValidate";

const FormItem = Form.Item;
const Option = Select.Option;

//  用户名表单
class UserNameForm extends Component {
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onOk(values).then(res => {
          if (res && res.result) {
            Message["success"](i18n["account.userName.changed"]);
            this.props.onCancel();
            this.props.getAccountList();
          }
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <FormItem label={i18n["userinfo.base.username"]}>
          {getFieldDecorator("username", {
            rules: [
              {
                required: true,
                message: i18n["userinfo.base.username.required.errormsg"]
              },
              {
                pattern: /^[^~!@#$%&*^&()+]{2,20}$/,
                message: i18n["userinfo.base.username.required.errormsg"]
              }
            ]
          })(<Input placeholder={i18n["userinfo.base.username.savetips"]} />)}
        </FormItem>
        <div className="basic-btn">
          <Button onClick={this.props.onCancel}>
            {i18n["general.button.cancel"]}
          </Button>
          <Button onClick={this.handleSubmit} type="primary">
            {i18n["general.button.ok"]}
          </Button>
        </div>
      </Form>
    );
  }
}
export const UserName = Form.create()(UserNameForm);

//  修改密码
class PassWordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDoubleModal: false,
      formValues: {}
    };
  }
  // 二次验证
  doubleValidate = values => {
    const { configAcessResult, validateSettingData } = this.props;
    //one 是否启用
    if (_.get(configAcessResult, "twoFAConfig.enable", false)) {
      // sc是否配置，配置后 tw是否启用，并且 启用的要和sc配置的一致
      // 设置了验证方式, 并且验证方式是在sc中启用了的
      const isEnabled = validateSettingData.some(item =>
        _.get(configAcessResult, "twoFAConfig.types", []).includes(item.type)
      );
      if (
        isEnabled &&
        _.get(configAcessResult, "twoFAConfig.operation", []).includes(
          "CHANGE_PASSWORD"
        )
      ) {
        this.setState({
          isShowDoubleModal: true
        });
      } else {
        this.afterValidate(values);
      }
    } else {
      // 未启用
      this.afterValidate(values);
    }
  };
  afterValidate = values => {
    this.props
      .onOk({
        origin: values.origin,
        newPwd: values.newPwd,
        verified: values.verified
      })
      .then(res => {
        if (res && res.result) {
          Message["success"](i18n["password.modify.success"]);
          this.props.onCancel();
        }
      })
      .catch(err => {
        Message["error"](i18n["userinfo.base.password.update.failed"]);
      });
  };
  closeDoubleModal = () => {
    this.setState({
      isShowDoubleModal: false
    });
  };
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          formValues: values
        });
        this.doubleValidate(values);
      }
    });
  };
  //  验证密码一致
  checkPswd = (rule, value, callback) => {
    const { form } = this.props;
    let val = form.getFieldsValue();
    if (val.newPwd !== val.verified) {
      callback(i18n["password.confirm.errMsg1"]);
    }
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { configAcessResult } = this.props;
    const { formValues, isShowDoubleModal } = this.state;
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
      <Form>
        <FormItem label={i18n["userinfo.base.password.originalpassword"]}>
          {getFieldDecorator("origin", {
            rules: [
              {
                required: true,
                message:
                  i18n[
                    "userinfo.base.password.originalpassword.required.errormsg"
                  ]
              }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem label={i18n["userinfo.base.password.newpassword"]}>
          {getFieldDecorator("newPwd", {
            rules: [
              {
                required: true,
                message:
                  i18n["userinfo.base.password.newpassword.required.errormsg"]
              },
              { pattern: pswdRegex, message: pswdPlaceHolder }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <FormItem label={i18n["userinfo.base.password.confirmnewpassword"]}>
          {getFieldDecorator("verified", {
            rules: [
              {
                required: true,
                message:
                  i18n[
                    "userinfo.base.password.confirmnewpassword.inconsistent.errormsg"
                  ]
              },
              { pattern: pswdRegex, message: pswdPlaceHolder },
              { validator: this.checkPswd }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <div className="basic-btn">
          <Button onClick={this.props.onCancel}>
            {i18n["general.button.cancel"]}
          </Button>
          <Button onClick={this.handleSubmit} type="primary">
            {i18n["general.button.ok"]}
          </Button>
        </div>
        {/* 二次验证弹窗 */}
        <DoubleValidate
          visible={isShowDoubleModal}
          operation="CHANGE_PASSWORD"
          afterOperate={this.afterValidate.bind(this, formValues)}
          closeModal={this.closeDoubleModal}
        />
      </Form>
    );
  }
}
export const PassWord = Form.create()(PassWordForm);

//  绑定邮箱
class EmailForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDoubleModal: false,
      formValues: {}
    };
  }
  // 二次验证q
  doubleValidate = values => {
    const { configAcessResult, validateSettingData } = this.props;
    //one 是否启用
    if (_.get(configAcessResult, "twoFAConfig.enable", false)) {
      // sc是否配置，配置后 tw是否启用，并且 启用的要和sc配置的一致
      // 设置了验证方式, 并且验证方式是在sc中启用了的
      const isEnabled = validateSettingData.some(item =>
        _.get(configAcessResult, "twoFAConfig.types", []).includes(item.type)
      );
      if (
        isEnabled &&
        _.get(configAcessResult, "twoFAConfig.operation", []).includes(
          "CHANGE_EMAIL"
        )
      ) {
        this.setState({
          isShowDoubleModal: true
        });
      } else {
        this.afterValidate(values);
      }
    } else {
      // 未启用
      this.afterValidate(values);
    }
  };
  afterValidate = values => {
    this.props
      .onOk({
        email: values.email,
        password: values.password
      })
      .then(res => {
        if (res && res.result) {
          Message["success"](i18n["account.email.send.success"]);
          this.props.onCancel();
          this.props.getAccountList();
        }
      })
      .catch(err => {
        Message["error"](i18n["userinfo.base.email.bind.failed"]);
      });
  };
  closeDoubleModal = () => {
    this.setState({
      isShowDoubleModal: false
    });
  };
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          formValues: values
        });
        this.doubleValidate(values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { email } = this.props;
    const { formValues, isShowDoubleModal } = this.state;

    return (
      <Form>
        {email && (
          <FormItem label={i18n["userinfo.base.email"]}>
            {getFieldDecorator("curEmail", {
              initialValue: email
            })(<Input disabled />)}
          </FormItem>
        )}
        <FormItem label={i18n["userinfo.base.email.newemail"]}>
          {getFieldDecorator("email", {
            rules: [
              {
                required: true,
                message: i18n["forgetpwd.errormsg.email.required"]
              },
              {
                pattern: emailRegex,
                message: i18n["forgetpwd.errormsg.email.invalid"]
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label={i18n["userinfo.base.password"]}>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: i18n["userinfo.base.email.password.required.errormsg"]
              }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <div className="basic-btn">
          <Button onClick={this.props.onCancel}>
            {i18n["general.button.cancel"]}
          </Button>
          <Button onClick={this.handleSubmit} type="primary">
            {i18n["userinfo.base.email.sendverification"]}
          </Button>
        </div>
        {/* 二次验证弹窗 */}
        <DoubleValidate
          visible={isShowDoubleModal}
          operation="CHANGE_EMAIL"
          afterOperate={this.afterValidate.bind(this, formValues)}
          closeModal={this.closeDoubleModal}
        />
      </Form>
    );
  }
}
export const ModifyEmail = Form.create()(EmailForm);

//  绑定手机
class ModifyPhoneForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // countryCode: getTypeCountryCode(),
      countryCode: props.countryCode|| getTypeCountryCode(),
      disabled: false,
      restTime: 59,
      formValues: {}
    };
  }
  afterValidate = values => {
    const {
      onOk,
      onCancel,
      getAccountList,
      configAcessResult,
      validateSettingData,
      onTabChange
    } = this.props;
    const isEnable = validateSettingData.some(item =>
      _.get(configAcessResult, "twoFAConfig.types", []).includes(item.type)
    );
    const isSetForceValidate =
      _.get(configAcessResult, "twoFAConfig.mandatoryVerification", false) &&
      !isEnable;
    onOk(values).then(res => {
      if (res && res.result) {
        Message["success"](i18n["userinfo.base.email.bind.success"]);
        onCancel();
        getAccountList();
        if (isSetForceValidate) {
          onTabChange("3");
        }
      } else {
        Message["error"](i18n["userinfo.base.phone.bind.failed"]);
      }
    });
  };
  handleSubmit = () => {
    const { countryCode } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          formValues: values
        });
        const params = Object.assign({}, values, { countryCode });
        this.afterValidate(params);
      }
    });
  };
  //  获取验证码
  getCode = () => {
    let value = this.props.form.getFieldsValue();
    this.props.getCheckCode(this.state.countryCode, value.phone).then(rs => {
      if (rs.result) {
        this.setState({
          disabled: true
        });
        let timer = setInterval(() => {
          let restTime = --this.state.restTime;
          if (restTime === 0) {
            clearInterval(timer);
            this.setState({
              disabled: false,
              restTime: 59
            });
            return;
          }
          this.setState({
            restTime
          });
        }, 1000);
      }
    });
  };
  onSelect = val => {
    this.setState({
      countryCode: val
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { phone } = this.props;
    const { restTime, disabled, formValues, isShowDoubleModal, countryCode } = this.state;
    return (
      <Form>
        {phone && (
          <FormItem label={i18n["userinfo.base.phone.bindphone"]}>
            <Input disabled value={`${countryCode} ${phone}`} />
          </FormItem>
        )}
        <FormItem label={i18n["userinfo.base.phone"]}>
          {getFieldDecorator("phone", {
            validateFirst: true,
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
                />
              }
              placeholder={i18n["signup.mobile"]}
            />
          )}
        </FormItem>
        <Row className="country-code">
          <Col span={16}>
            <FormItem>
              {getFieldDecorator("code", {
                rules: [
                  {
                    required: true,
                    message:
                      i18n["userinfo.base.phone.captcha.required.errormsg"]
                  }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
          <Col className="country-code-btn" span={8}>
            <Button disabled={disabled} onClick={this.getCode}>
              {disabled
                ? restTime + i18n["general.resend"]
                : i18n["general.getverifycode"]}
            </Button>
          </Col>
        </Row>
        <FormItem label={i18n["userinfo.base.password"]}>
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: i18n["userinfo.base.email.password.required.errormsg"]
              }
            ]
          })(<Input type="password" />)}
        </FormItem>
        <div className="basic-btn">
          <Button onClick={this.props.onCancel}>
            {i18n["general.button.cancel"]}
          </Button>
          <Button onClick={this.handleSubmit} type="primary">
            {i18n["general.button.ok"]}
          </Button>
        </div>
      </Form>
    );
  }
}
export const ModifyPhone = Form.create()(ModifyPhoneForm);

//  新增银行
class AddBandForm extends Component {
  state = {
    add: false,
    bankName: ""
  };
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {
          type,
          updateBank,
          addNewBank,
          editItem,
          getBankAccounts
        } = this.props;
        if (type == "add") {
          addNewBank({
            SWIFT: values.swift,
            bankAccountName: values.bankAccountName,
            bankAccountNumber: values.bankAccountNumber,
            bankName: values.bankName,
            bankAddress: values.bankAddress,
            bankId: values.bankName,
            id: "",
            bankBranchName: values.bankBranchName,
            isDefault: values.isDefault
          }).then(res => {
            if (res.result) {
              Message["success"](i18n["broker.question.test_result.success"]);
              this.props.onCancel();
              getBankAccounts();
            }
          });
        } else if (type == "update") {
          updateBank({
            SWIFT: values.swift,
            bankAccountName: values.bankAccountName,
            bankAccountNumber: values.bankAccountNumber,
            bankName: values.bankName,
            bankAddress: values.bankAddress,
            bankId: values.bankName,
            id: editItem.id,
            bankBranchName: values.bankBranchName,
            isDefault: values.isDefault
          }).then(res => {
            if (res && res.result) {
              Message["success"](i18n["userinfo.base.email.bind.success"]);
              this.props.onCancel();
              getBankAccounts();
            }
          });
        }
      }
    });
  };
  //  下拉框搜索
  filterOption = (input, option) => {
    return option.props.children.indexOf(input) >= 0;
  };
  addBank = () => {
    this.setState({
      add: true
    });
  };
  closeBank = () => {
    this.setState({
      add: false
    });
  };
  confirm = () => {
    this.bankName = this.state.bankName;
    this.setState({
      add: false
    });
  };
  changeName = e => {
    let bankName = e.target.value;
    bankName = bankName.replace(/\d/, "");
    this.setState({
      bankName
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    let { allBank, structConfig, editItem } = this.props;
    if (this.bankName) {
      editItem = { ...editItem, bankName: this.bankName };
    }
    let mt4Withdraw =
      structConfig["MT4"] && structConfig["MT4"].withdrawSetting;
    let mt5Withdraw =
      structConfig["MT5"] && structConfig["MT5"].withdrawSetting;
    let cTraderWithdraw =
      structConfig["CTRADER"] && structConfig["CTRADER"].withdrawSetting;
    let branchRequired =
      (mt4Withdraw && mt4Withdraw.branchBank) ||
      (mt5Withdraw && mt5Withdraw.branchBank) ||
      (cTraderWithdraw && cTraderWithdraw.branchBank);
    let swiftRequired =
      (mt4Withdraw && mt4Withdraw.bankSwift) ||
      (mt5Withdraw && mt5Withdraw.bankSwift) ||
      (cTraderWithdraw && cTraderWithdraw.bankSwift);
    let addressRequired =
      (mt4Withdraw && mt4Withdraw.bankAddress) ||
      (mt5Withdraw && mt5Withdraw.bankAddress) ||
      (cTraderWithdraw && cTraderWithdraw.bankAddress);
    return [
      <Form>
        <FormItem label={i18n["userinfo.bank.payee"]}>
          {getFieldDecorator("bankAccountName", {
            initialValue: editItem && editItem.bankAccountName,
            rules: [
              { required: true, message: i18n["userinfo.bank.payee.required"] }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label={i18n["userinfo.bank.account"]}>
          {getFieldDecorator("bankAccountNumber", {
            initialValue: editItem && editItem.bankAccountNumber,
            rules: [
              {
                required: true,
                message: i18n["userinfo.banck.account.invalid"]
              },
              {
                pattern: /\d+/,
                message: i18n["userinfo.banck.account.invalid"]
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label={i18n["userinfo.bank.name"]}>
          {getFieldDecorator("bankName", {
            initialValue: editItem && editItem.bankName,
            rules: [{ required: true, message: i18n["mobile.withdraw.bank"] }]
          })(
            <Select
              notFoundContent={
                <div>
                  <Divider style={{ margin: "4px 0" }} />
                  <div
                    onClick={this.addBank}
                    style={{ color: "#000", padding: "8px", cursor: "pointer" }}
                  >
                    <Icon type="plus" /> {i18n["userinfo.bank.addBank"]}
                  </div>
                </div>
              }
              showSearch
              filterOption={this.filterOption}
            >
              {allBank &&
                allBank.map((item, index) => {
                  return <Option value={item.value}>{item.label}</Option>;
                })}
            </Select>
          )}
        </FormItem>
        <FormItem label={i18n["userinfo.bank.branchname"]}>
          {getFieldDecorator("bankBranchName", {
            initialValue: editItem && editItem.bankBranchName,
            rules: [
              {
                required: branchRequired,
                message: i18n["withdraw.bankBranchName.errMsg"]
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label={i18n["userinfo.bank.swiftcode"]}>
          {getFieldDecorator("swift", {
            initialValue: editItem && editItem.SWIFT,
            rules: [
              {
                required: swiftRequired,
                message: i18n["withdraw.swiftCode.required"]
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem label={i18n["userinfo.bank.address"]}>
          {getFieldDecorator("bankAddress", {
            initialValue: editItem && editItem.bankAddress,
            rules: [
              {
                required: addressRequired,
                message: i18n["withdraw.bankAddress.errMsg"]
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator("isDefault", {
            initialValue: editItem && editItem.isDefault
          })(
            <Checkbox defaultChecked={editItem && editItem.isDefault}>
              {i18n["userinfo.bank.settodefault.label"]}
            </Checkbox>
          )}
        </FormItem>
        <div className="basic-btn">
          <Button onClick={this.handleSubmit} type="primary">
            {i18n["general.button.ok"]}
          </Button>
          <Button onClick={this.props.onCancel}>
            {i18n["general.button.cancel"]}
          </Button>
        </div>
      </Form>,
      <Modal
        title={i18n["userinfo.bank.addBankName"]}
        visible={this.state.add}
        onCancel={() => this.setState({ add: false })}
        footer={
          <span>
            <Button onClick={this.confirm} type="primary">
              {i18n["general.button.sure"]}
            </Button>
            <Button
              onClick={() => {
                this.setState({ add: false });
              }}
            >
              {i18n["general.button.cancel"]}
            </Button>
          </span>
        }
      >
        <Input value={this.state.bankName} onChange={this.changeName} />
      </Modal>
    ];
  }
}
export const AddBand = Form.create()(AddBandForm);
