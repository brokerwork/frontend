import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Select, Row, Col } from "antd";

import "./modifyPwd.less";
import i18n from "@/utils/i18n";
import message from "@/components/Message";
import Button from "@/components/Button";
import * as appActions from "@/actions/App/app";
import * as actions from "@/actions/Account/modifyPwd";
import { configAccess } from "@/actions/Common/common";
import DoubleValidate from "@/components/DoubleValidate";

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  }
};

class ModifyPwdForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDoubleModal: false,
      formValues: {}
    };
  }

  componentDidMount() {
    this.props.setHeaderTitle(i18n["menu.modify.password"]);
    this.props.configAccess();
  }
  componentWillReceiveProps() {
    this.props.setHeaderTitle(i18n["menu.modify.password"]);
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
          "ACCOUNT_CHANGE_PASSWORD"
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
    this.props.modifyPwd(values).then(res => {
      if (res && res.result) {
        message["success"](i18n["password.modify.success"]);
        this.props.form.resetFields();
      }
    });
  };
  closeDoubleModal = () => {
    this.setState({
      isShowDoubleModal: false
    });
  };
  //  提交表单
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
    if (val.newPassword !== val.verifyPassword) {
      callback(i18n["password.confirm.errMsg1"]);
    }
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { account } = this.props;
    const { formValues, isShowDoubleModal } = this.state;

    return (
      <div className="page modify-pwd">
        <Form>
          <FormItem {...formItemLayout} label={i18n["leverage.trade.account"]}>
            {getFieldDecorator("account", {
              initialValue: account && account.currAccount.account
            })(<Input disabled />)}
          </FormItem>
          <FormItem {...formItemLayout} label={i18n["password.type"]}>
            {getFieldDecorator("pwdType", {
              initialValue: "MainPwd"
            })(
              <Select>
                <Option value="MainPwd">{i18n["password.type.trade"]}</Option>
                <Option value="InvestorPwd">
                  {i18n["password.type.investment"]}
                </Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={i18n["password.current"]}>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: i18n["password.current.tip"]
                }
              ]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label={i18n["password.new"]}>
            {getFieldDecorator("newPassword", {
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: i18n["password.new.errMsg"],
                  pattern: /^(?!([a-zA-Z]+|\d+)$).{5,12}$/,
                  message: i18n["password.new.errMsg"]
                }
              ]
            })(<Input type="password" />)}
          </FormItem>
          <FormItem {...formItemLayout} label={i18n["password.confirm"]}>
            {getFieldDecorator("verifyPassword", {
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: i18n["password.confirm.errMsg1"]
                },
                {
                  validator: this.checkPswd
                }
              ]
            })(<Input type="password" />)}
          </FormItem>
          <Row>
            <Col offset={3}>
              <Button onClick={this.handleSubmit} type="primary">
                {i18n["general.submit.tw"]}
              </Button>
            </Col>
          </Row>
        </Form>
        {/* 二次验证弹窗 */}
        <DoubleValidate
          visible={isShowDoubleModal}
          operation="ACCOUNT_CHANGE_PASSWORD"
          afterOperate={this.afterValidate.bind(this, formValues)}
          closeModal={this.closeDoubleModal}
        />
      </div>
    );
  }
}
const ModifyPwd = Form.create()(ModifyPwdForm);

export default connect(
  ({ app, common }) => {
    return {
      account: app.account,
      structConfig: app.structConfig,
      configAcessResult: common.configAcessResult,
      validateSettingData: common.validateSettingData
    };
  },
  {
    ...actions,
    ...appActions,
    configAccess
  }
)(ModifyPwd);
