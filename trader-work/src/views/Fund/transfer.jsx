import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Select, InputNumber, Modal, Checkbox } from "antd";
import ScaleModal from "@/components/ScaleModal";
import "./transfer.less";
import i18n from "@/utils/i18n";
import { ACCOUNT_DATA, USER_INFO } from "@/utils/storage";
import message from "@/components/Message";
import Button from "@/components/Button";
import Card from "@/components/Card";
import FileUpload from "@/components/FileUpload";
import * as actions from "@/actions/Fund/transfer";
import { setHeaderTitle } from "@/actions/App/app";
import { configAccess } from "@/actions/Common/common";
import DoubleValidate from "@/components/DoubleValidate";
const isCustomReg = /^CUSTOM(.*?)$/; // 判断是否为自定义平台，以CUSTOM开头

const FormItem = Form.Item;
const Option = Select.Option;

class Transfer extends Component {
  maxWithdraw = "";
  account = "";
  accountNameObj = {};
  lock = false;
  state = {
    isOther: false,
    showInfo: false,
    info: {},
    isChecked: false,
    visible: false,
    isShowDoubleModal: false,
    formValues: {},
    verifyData: {},
    items: [
      {
        label: i18n["transfer.transferAccount"],
        type: "text",
        disabled: true,
        field: "account",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["transfer.transferAccountName"],
        type: "text",
        disabled: true,
        field: "accountName",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["transfer.currency"],
        type: "text",
        disabled: true,
        field: "depositCurrency",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["transfer.balance"],
        type: "text",
        disabled: true,
        field: "balance",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["transfer.actualBalance"],
        type: "text",
        disabled: true,
        field: "maxWithdraw",
        value: "",
        rules: [
          {
            required: false
          }
        ]
      },
      {
        label: i18n["transfer.amount"],
        type: "text",
        disabled: false,
        field: "transferAmount",
        rules: [
          {
            required: true,
            message: i18n["transfer.amount.errMsg"]
          },
          {
            pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
            message: i18n["transfer.amount.errMsg1"]
          },
          {
            validator: (rule, value, callback) => {
              const vendor = this.props.account.currAccount.vendor;
              const isCustom = vendor && vendor.indexOf("CUSTOM") > -1;

              if (value > this.maxWithdraw && !isCustom) {
                callback(new Error(i18n["transfer.amount.errMsg2"]));
              } else {
                callback();
              }
            }
          }
        ]
      },
      {
        label: i18n["transfer.transferredAccount"],
        control: true,
        type: "select",
        disabled: false,
        list: [],
        field: "receiptUser",
        rules: [
          {
            required: true,
            message: i18n["transfer.pleaseChooseAccount"]
          }
        ]
      },
      {
        label: i18n["transfer.transferredAccountNum"],
        other: true,
        type: "text",
        disabled: false,
        field: "receiptAccount",
        rules: [
          {
            required: true,
            message: i18n["transfer.transferredAccountNum.errMsg"]
          },
          // {
          //   type: 'integer',
          //   message: '转入帐户账号应为数字类型，且不能和转出帐户相同'
          // },
          {
            validator: (rule, value, callback) => {
              if (value == this.account) {
                callback(
                  new Error(i18n["transfer.transferredAccountNum.errMsg"])
                );
              } else {
                callback();
              }
            }
          }
        ]
      },
      {
        label: i18n["transfer.transferredAccountName"],
        other: true,
        type: "text",
        disabled: false,
        field: "receiptAccountName",
        rules: [
          {
            required: true,
            message: i18n["transfer.transferredAccountName.errMsg"]
          }
        ]
      },
      {
        label: i18n["transfer.transferredAccountServer"],
        other: true,
        type: "select",
        disabled: false,
        list: [],
        field: "receiptServer",
        rules: [
          {
            required: true,
            message: i18n["transfer.pleaseChooseAccount"]
          }
        ]
      },
      {
        label: i18n["general.comment.tw"],
        type: "text",
        disabled: false,
        required: false,
        field: "comment"
      }
    ]
  };
  componentDidMount() {
    this.props.setHeaderTitle(i18n["menu.fundmgmt.transfer"]);
    this.props.configAccess();
  }
  componentWillReceiveProps = () => {
    this.props.setHeaderTitle(i18n["menu.fundmgmt.transfer"]);
    if (
      !this.props.accountList.liveAccountList.length ||
      !this.props.structConfig ||
      this.lock
    )
      return;
    let accountList = this.props.accountList.liveAccountList;
    let items = [...this.state.items];
    this.getFieldValue(items, "receiptUser").list = accountList.map(el => {
      this.accountNameObj[el.account] = {
        serverId: el.serverId,
        accountName: el.accountName,
        vendor: el.vendor
      }; //存账户名
      return {
        key: el.account,
        label: el.account
      };
    });
    let { enabled } = this.props.structConfig[this.currentPlatform].tranSetting;
    if (enabled) {
      this.getFieldValue(items, "receiptUser").list.push({
        key: "other",
        label: i18n["transfer.other"]
      });
    }

    // 取数据
    let data = this.props.account.currAccount;
    this.account = data.account;
    this.vendor = data.vendor;
    items.forEach(el => {
      el.value = data[el.field];
    });
    //在自定义平台时 如果没有currency信息，则隐藏账户货币
    if (isCustomReg.test(data.vendor) && !data.depositCurrency) {
      this.getFieldValue(items, "depositCurrency").hide = true;
    }
    //在自定义平台时 当接口没有返回账户余额，可转账余额时，则对应字段不展示
    const balanceValue = this.props.accountList.liveAccountList.find(el => {
      return el.account === data.account;
    }).balance;
    if (balanceValue) {
      this.getFieldValue(items, "balance").value = balanceValue;
    } else {
      isCustomReg.test(data.vendor) &&
        (this.getFieldValue(items, "balance").hide = true);
    }
    this.getFieldValue(items, "receiptUser").list = this.getFieldValue(
      items,
      "receiptUser"
    ).list.filter(el => {
      return el.key !== data.account;
    });
    this.setState({
      items
    });

    // 取账户服务器
    this.props.fetchPlatforms(this.vendor).then(rs => {
      if (rs.result) {
        let items = [...this.state.items];
        this.getFieldValue(items, "receiptServer").list = rs.data.map(el => {
          return {
            key: el.serverId,
            label: el.serverName
          };
        });
        this.setState({
          items
        });
      }
    });
    // 取可用余额
    this.props.fetchRestAmount().then(rs => {
      if (rs.result) {
        let items = [...this.state.items];
        if (rs.data) {
          this.getFieldValue(items, "maxWithdraw").value = rs.data;
        } else {
          isCustomReg.test(this.vendor) &&
            (this.getFieldValue(items, "maxWithdraw").hide = true);
        }
        this.maxWithdraw = rs.data;
        this.setState({
          items
        });
      }
    });
    this.lock = true;
  };
  componentWillMount = () => {
    this.currentPlatform = this.props.account.currAccount.vendor;
    this.userId = JSON.parse(localStorage.getItem(USER_INFO)).userId;
  };
  // 获取item对应field的项
  getFieldValue = (items, name) => {
    return items && items.length && items.find(item => item.field === name);
  };
  handleChange = (control, value) => {
    if (control) {
      this.setState({
        isOther: value.key == "other"
      });
    }
  };
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
          "ACCOUNT_TRANSFER"
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
    let info = { ...values };
    if (!this.state.isOther) {
      info.receiptUserId = this.userId;
    }
    // info.receiptUserName = info.receiptUser.label
    info.receiptVendor =
      info.receiptUser.key === "other"
        ? this.currentPlatform
        : this.accountNameObj[info.receiptUser.key].vendor;
    info.receiptAccount =
      info.receiptUser.key === "other"
        ? info.receiptAccount
        : info.receiptUser.key;

    if (info.receiptUser.key !== "other") {
      info.receiptAccountName = this.accountNameObj[
        info.receiptUser.key
      ].accountName;
    }
    info.receiptServerId =
      (info.receiptServer && info.receiptServer.key) ||
      this.accountNameObj[info.receiptUser.key].serverId;
    info.receiptServerName = info.receiptServer && info.receiptServer.label;
    info.currency = info.depositCurrency;
    let showInfo = { ...info };
    delete info.receiptUser;
    delete info.receiptServer;
    delete info.receiptServerName;
    delete info.account;
    delete info.accountName;
    delete info.balance;
    delete info.depositCurrency;
    delete info.maxWithdraw;
    if (this.state.isOther) {
      this.props.saveTransfer(info).then(rs => {
        if (rs.result) {
          if (rs.data.allow) {
            this.setState({
              showInfo: true,
              info: showInfo,
              verifyData: rs.data
            });
          } else {
            message.warning(i18n["transfer.message.errTip4"]);
          }
        }
      });
    } else {
      this.props.confirm(info).then(rs => {
        if (rs.result) {
          message.success(i18n["transfer.message.succTip1"]);
          setTimeout(() => {
            window.location.href = "/fund/transfer";
          }, 2000);
        }
      });
    }
  };
  closeDoubleModal = () => {
    this.setState({
      isShowDoubleModal: false
    });
  };
  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          formValues: values
        });
        this.doubleValidate(values);
      }
    });
  };
  confirm = () => {
    if (this.state.isChecked) {
      this.props.confirm(this.state.info).then(rs => {
        if (rs.result) {
          message.success(i18n["transfer.message.succTip1"]);
          setTimeout(() => {
            window.location.href = "/fund/transfer";
          }, 2000);
        }
      });
    } else {
      message.warning(i18n["openaccount.risktip.confirm.required"]);
    }
  };
  onCheck = e => {
    let isChecked = e.target.checked;
    this.setState({
      isChecked
    });
  };
  open = e => {
    e.preventDefault();
    this.setState({
      visible: true
    });
  };
  handleOk = () => {
    this.setState({
      visible: false
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    const { formValues, isShowDoubleModal, verifyData } = this.state;

    let formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 5 }
    };
    let { getFieldDecorator } = this.props.form;
    if (!this.props.structConfig) {
      return null;
    }
    let { agreement } = this.props.structConfig[
      this.currentPlatform
    ].tranSetting;

    return (
      <div className="page transfer">
        <Form
          layout="horizontal"
          style={{ display: !this.state.showInfo ? "block" : "none" }}
        >
          {this.state.items
            .filter(item => !item.hide)
            .map(el => {
              let Item;
              if (el.type === "text") {
                Item = <Input disabled={el.disabled} />;
              } else if (el.type === "select") {
                Item = (
                  <Select
                    disabled={el.disabled}
                    labelInValue
                    onChange={value => {
                      this.handleChange(el.control, value);
                    }}
                  >
                    {el.list.map(el => {
                      return <Option value={el.key}>{el.label}</Option>;
                    })}
                  </Select>
                );
              }
              if (el.other) {
                return this.state.isOther ? (
                  <FormItem {...formItemLayout} label={el.label}>
                    {getFieldDecorator(el.field, {
                      rules: el.rules,
                      initialValue: el.value
                    })(Item)}
                  </FormItem>
                ) : null;
              } else {
                return (
                  <FormItem {...formItemLayout} label={el.label}>
                    {getFieldDecorator(el.field, {
                      rules: el.rules,
                      initialValue: el.value
                    })(Item)}
                  </FormItem>
                );
              }
            })}
          <FormItem style={{ marginLeft: 150 }}>
            <Button
              style={{ lineHeight: "32px" }}
              type="primary"
              onClick={this.onSubmit}
            >
              {i18n["bindaccount.submit"]}
            </Button>
          </FormItem>
        </Form>
        <div
          className="confirm-container"
          style={{ display: this.state.showInfo ? "block" : "none" }}
        >
          <div className="title">{i18n["transfer.confirmViewTitle"]}</div>
          <div className="content">
            <div className="header">
              {i18n["transfer.remittance.information"]}
            </div>
            <ul className="body">
              <li>
                <span>{i18n["transfer.transferAccount"]}</span>
                <span>{this.state.info.account}</span>
              </li>
              <li>
                <span>{i18n["transfer.transferAccountName"]}</span>
                <span>{this.state.info.accountName}</span>
              </li>
              <li>
                <span>{i18n["transfer.transferAmount"]}</span>
                <span>{this.state.info.transferAmount}</span>
              </li>
              <li>
                <span>{i18n["transfer.transferredAccount"]}</span>
                <span>{this.state.info.receiptAccount}</span>
              </li>
              <li>
                <span>{i18n["transfer.transferredAccountName"]}</span>
                <span>
                  {this.state.info.receiptAccountName}
                  {!verifyData.accountNameCorrect && (
                    <strong className="red">
                      （{i18n["transfer.transferredAccountName.notMatch"]}）
                    </strong>
                  )}
                </span>
              </li>
              <li>
                <span>{i18n["transfer.transferredAccountServer"]}</span>
                <span>{this.state.info.receiptServerName}</span>
              </li>
              <li>
                <span>{i18n["general.comment.tw"]}</span>
                <span>{this.state.info.comment}</span>
              </li>
            </ul>
          </div>
          <div className="agreement">
            <Checkbox onChange={this.onCheck}>
              {i18n["transfer.read"]}{" "}
              <span className="third" onClick={this.open}>
                {i18n["transfer.agreement"]}
              </span>{" "}
              ,{i18n["transfer.agreeTransfer"]}
            </Checkbox>
            <ScaleModal
              title={i18n["transfer.agreement"]}
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={null}
            >
              <div dangerouslySetInnerHTML={{ __html: agreement }} />
            </ScaleModal>
          </div>
          <div className="footer">
            <Button type="primary" onClick={this.confirm}>
              {i18n["transfer.confirmSubmit"]}
            </Button>
            <Button
              onClick={() => {
                this.setState({ showInfo: false });
              }}
            >
              {i18n["general.modify.tw"]}
            </Button>
            <Button onClick={window.print}>{i18n["general.print"]}</Button>
          </div>
        </div>

        {/* 二次验证弹窗 */}
        <DoubleValidate
          visible={isShowDoubleModal}
          operation="ACCOUNT_TRANSFER"
          afterOperate={this.afterValidate.bind(this, formValues)}
          closeModal={this.closeDoubleModal}
        />
      </div>
    );
  }
}
let TransferFrom = Form.create()(Transfer);
export default connect(
  ({ app, common, fund }) => {
    return {
      account: app.account,
      structConfig: app.structConfig,
      struct: app.struct,
      brand: common.brandInfo,
      accountList: app.accountList,
      configAcessResult: common.configAcessResult,
      validateSettingData: common.validateSettingData
    };
  },
  { ...actions, setHeaderTitle, configAccess }
)(TransferFrom);
