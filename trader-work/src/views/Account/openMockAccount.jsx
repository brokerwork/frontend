import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@/components/Button";
import { Form, Input, Select } from "antd";

import VendorHeader from "./vendorHeader";
import "./openMockAccount.less";
import i18n from "@/utils/i18n";
import { emailRegex, phoneRegex } from "@/utils/validate";
import message from "@/components/Message";
import * as appActions from "@/actions/App/app";
import * as actions from "@/actions/Account/openMockAccount";
import { getType } from "@/utils/language";

const FormItem = Form.Item;
const Option = Select.Option;

class openMockAccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      vendor: props.match.params.vendor
    };
  }

  componentDidMount() {
    this.props.setHeaderTitle(i18n["openaccount.open.demoaccount"]);
  }
  componentWillReceiveProps() {
    this.props.setHeaderTitle(i18n["openaccount.open.demoaccount"]);
  }
  //  提交表单
  handleSubmit = e => {
    e.preventDefault();
    let { form, applyDemo, match } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ disabled: true });
        let demoInfo = {
          vendor: match.params.vendor,
          ...values
        };
        if (demoInfo.vendor === "CTRADER") {
          Object.assign(demoInfo, { ctid: this.props.ctid });
        }
        applyDemo(demoInfo)
          .then(res => {
            this.setState({ disabled: false });
            if (res && res.result) {
              message["success"](i18n["mockaccount.applying.success"]);
            }
          })
          .catch(() => {
            this.setState({ disabled: false });
          });
      }
    });
  };

  //  渲染服务器类型
  renderOption(typeList, vendor) {
    return typeList.length
      ? typeList.map((item, index) => {
          return (
            <Option key={index} value={item.typeId}>
              {vendor === "CTRADER"
                ? item.typeName
                : item.typeNames
                ? item.typeNames[getType()]
                : ""}
            </Option>
          );
        })
      : null;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { match, structConfig } = this.props;
    let bindIcon = "";
    let vendorName = "";
    let vendor = match.params.vendor;
    let accountTypeList = structConfig
      ? structConfig[vendor].accountTypeList
      : [];
    let defaultValue = accountTypeList.length
      ? accountTypeList[0].typeId
      : null;
    if (structConfig && vendor && structConfig[vendor]) {
      bindIcon = structConfig[vendor].basicSetting.structuralLogo;
      vendorName = structConfig[vendor].basicSetting.structuralName;
    }
    return (
      <div className="mock-account">
        <VendorHeader
          bindIcon={bindIcon}
          vendorName={vendorName}
          description={i18n["mockaccount.description"]}
        />
        <Form>
          <FormItem label={i18n["mockaccount.name"]}>
            {getFieldDecorator("accountName", {
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: i18n["mockaccount.name.tip"]
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n["mockaccount.email"]}>
            {getFieldDecorator("accountEmail", {
              validateFirst: true,
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: i18n["mockaccount.email.tip"]
                },
                {
                  pattern: emailRegex,
                  message: i18n["mockaccount.email.tip"]
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n["mockaccount.phone"]}>
            {getFieldDecorator("accountPhone", {
              validateFirst: true,
              validateTrigger: "onBlur",
              rules: [
                {
                  pattern: phoneRegex,
                  message: i18n["mockaccount.phone.tip"]
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label={i18n["mockaccount.type"]}>
            {getFieldDecorator("accountType", {
              validateFirst: true,
              initialValue: defaultValue,
              rules: [
                {
                  required: true,
                  message: i18n["fastSignup.accountType.required"]
                }
              ]
            })(<Select>{this.renderOption(accountTypeList, vendor)}</Select>)}
          </FormItem>
          <Button
            disabled={this.state.disabled}
            onClick={this.handleSubmit}
            type="primary"
            htmlType="submit"
          >
            {i18n["mockaccount.submit"]}
          </Button>
        </Form>
      </div>
    );
  }
}

const openMockAccount = Form.create()(openMockAccountForm);

export default connect(
  ({ app, common }) => {
    return {
      structConfig: app.structConfig,
      ctid: common.ctid
    };
  },
  {
    ...actions,
    ...appActions
  }
)(openMockAccount);
