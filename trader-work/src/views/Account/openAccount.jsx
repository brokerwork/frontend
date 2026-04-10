import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@/components/Button";
import CtidModal from "./ctidModal.jsx";
import { injectIntl } from "react-intl";
import "./openAccount.less";
import i18n from "@/utils/i18n";
import message from "@/components/Message";
import * as actions from "@/actions/Account/openAccount";
import * as appActions from "@/actions/App/app";
import { getDemoAccountCheck } from "@/actions/Common/common";
import { Modal, Radio } from "antd";
import { getType } from "@/utils/language";

class openAccount extends Component {
  constructor() {
    super();
    this.state = {
      //  合规性测试开关数据
      hasPassTestData: {},
      visible: false,
      ctraderValue: "1",
      ctEmail: "",
      type: "",
      modalAccountType: false,
      accountType: "",
      listItem: {},
      openType: ""
    };
  }
  componentWillReceiveProps() {
    this.props.setHeaderTitle(i18n["menu.accountmgmt.openaccount"]);
  }
  componentDidMount() {
    const {
      isPassTest,
      getPlatformList,
      setHeaderTitle,
      location,
      getDemoAccountCheck
    } = this.props;
    setHeaderTitle(i18n["menu.accountmgmt.openaccount"]);
    getPlatformList().then(res => {
      if (res && res.result) {
        if (
          location.search.indexOf("fromRegister") !== -1 &&
          res.data.length === 1 &&
          res.data[0].featureStatus.LiveAccount
        ) {
          this.openReal(res.data[0]);
        }
      }
    });
    isPassTest().then(res => {
      if (res && res.result) {
        this.setState({
          hasPassTestData: res.data
        });
      }
    });
    getDemoAccountCheck();
  }

  //  是否需要合规性测试
  isTest = () => {
    const { hasPassTestData } = this.state;
    let result = false;
    if (!hasPassTestData.hasTested || hasPassTestData.result == "refuse") {
      result = true;
    } else {
      result = false;
    }
    return result;
  };

  //  去绑定账户
  bindAccount = item => {
    const { hasPassTestData } = this.state;
    const featureStatus = item.featureStatus || {};
    if (featureStatus.BindAccount === "Enabled") {
      //  合规性测试判断
      if (this.isTest()) {
        this.props.history.push(
          `/account/open/acttest/account/open/bind/${item.vendor}`
        );
      } else {
        this.props.history.push(`/account/open/bind/${item.vendor}`);
      }
    } else if (featureStatus.BindingInProgressing === "Enabled") {
      return message["warning"](i18n["openaccount.bindaccount.applying"]);
    }
  };

  //  审核中按钮
  progressing = item => {
    const featureStatus = item.featureStatus || {};
    if (featureStatus.LiveAccountApplicationInProgressing === "Enabled") {
      this.props.history.push(`/account/open/applying/live/${item.vendor}`);
    } else if (
      featureStatus.ApplyAccountWithSavedInfoInProgressing === "Enabled"
    ) {
      this.props.history.push(`/account/open/applying/same/${item.vendor}`);
    }
  };

  //  开真实账户
  openReal = item => {
    //判断前置条件如果为无条件则和以前流程一样，如果是需开设模拟账户，则判断是否有模拟账户，如果没有则提示 AllowBeforeDemo accountDemoCheck
    const { accountDemoCheck } = this.props;
    const featureStatus = item.featureStatus || {};
    if (featureStatus.AllowBeforeDemo) {
      if (!accountDemoCheck[item.vendor]) {
        message["warning"](i18n["openaccount.realeAccount.before.tips"]);
        return;
      }
    }
    const { accountType } = this.state;
    if (this.isTest()) {
      this.props.history.push(
        `/account/open/acttest/account/open/real/${item.vendor}${
          accountType ? `?accountType=${accountType}` : ""
        }`
      );
    } else {
      if (item.vendor === "CTRADER") {
        this.setState({
          visible: true,
          type: "real"
        });
      } else {
        this.props.history.push(
          `/account/open/real/${item.vendor}?accountType=${accountType}`
        );
      }
    }
  };

  //  开同名账户
  openSame = item => {
    const { accountType } = this.state;
    let accountslimit = this.props.structConfig[item.vendor].basicSetting
      .maxCountSameAcount;
    let list = this.props.accountList.liveAccountList.filter(el => {
      return el.vendor == item.vendor;
    });
    let msg = this.props.intl.formatMessage(
      { id: "account.max.sameAccount" },
      { num: accountslimit }
    );
    if (list.length >= accountslimit + 1) {
      message["error"](msg);
      return;
    }
    if (this.isTest()) {
      this.props.history.push(
        `/account/open/acttest/account/open/same/${item.vendor}${
          accountType ? `?accountType=${accountType}` : ""
        }`
      );
    } else {
      if (item.vendor === "CTRADER") {
        this.setState({
          visible: true,
          type: "same"
        });
      } else {
        this.props.history.push(
          `/account/open/same/${item.vendor}?accountType=${accountType}`
        );
      }
    }
  };

  //  模拟帐户
  createMock = item => {
    if (item.vendor === "CTRADER") {
      this.setState({
        visible: true,
        type: "mock"
      });
    } else {
      this.props.history.push(`/account/open/mock/${item.vendor}`);
    }
  };
  //  渲染开户button
  renderBtn(item) {
    const featureStatus = item.featureStatus || {};
    return (
      <div className="account-button">
        {/* 真实开户按钮 */}
        {featureStatus.LiveAccount === "Enabled" && (
          <Button
            onClick={this.openAccountType.bind(this, "real", item)}
            type="primary"
          >
            {i18n["openaccount.liveaccount"]}
          </Button>
        )}
        {/* 同名开户按钮 */}
        {featureStatus.ApplyAccountWithSavedInfo === "Enabled" && (
          <Button
            onClick={this.openAccountType.bind(this, "same", item)}
            type="primary"
          >
            {i18n["openaccount.sameaccount"]}
          </Button>
        )}
        {/* 真实同名审核中按钮 */}
        {(featureStatus.LiveAccountApplicationInProgressing === "Enabled" ||
          featureStatus.ApplyAccountWithSavedInfoInProgressing ===
            "Enabled") && (
          <Button onClick={this.progressing.bind(this, item)} type="primary">
            {i18n["openaccount.applying"]}
          </Button>
        )}
        {/* 绑定账户按钮 */}
        {featureStatus.BindAccount === "Enabled" && (
          <Button onClick={this.bindAccount.bind(this, item)} type="solid">
            {i18n["openaccount.bindaccount"]}
          </Button>
        )}
        {featureStatus.BindingInProgressing === "Enabled" && (
          <Button onClick={this.bindAccount.bind(this, item)} type="solid">
            {i18n["openaccount.applying"]}
          </Button>
        )}
        {/* 模拟开户按钮 */}
        {featureStatus.DemoAccount === "Enabled" && (
          <Button onClick={this.createMock.bind(this, item)} type="solid">
            {i18n["openaccount.demoaccount"]}
          </Button>
        )}
      </div>
    );
  }

  //  渲染开户list
  renderList(item, index) {
    const { platformList } = this.props;
    return platformList.length
      ? platformList.map((item, index) => {
          return (
            <li
              key={index}
              className="account-list"
              style={item.enabled ? null : { display: "none" }}
            >
              <div className="account-logo">
                <div className="account-logo-inner">
                  <img src={item.logo} />
                </div>
              </div>
              <div className="account-wrapper">
                <span className="account-wrapper-title">
                  {item.displayName}
                </span>
                <span className="account-wrapper-content">
                  {item.description}
                </span>
              </div>
              {this.renderBtn(item)}
            </li>
          );
        })
      : null;
  }
  closeModal = () => {
    this.setState({
      visible: false
    });
  };
  isModalVisible = (name, visible) => {
    this.setState({
      [name]: visible
    });
  };
  // 多账户modal
  openAccountType = (type, item) => {
    const {
      accountTypeConfig: { accountTypeInfos }
    } = this.props;
    // 过滤权限
    const accountTypeList = accountTypeInfos.filter(
      info => _.get(info, `rights.${item.vendor}`, []).length
    );
    if (accountTypeList && accountTypeList.length > 1) {
      this.isModalVisible("modalAccountType", true);
      this.setState({
        listItem: item,
        openType: type
      });
    } else if (accountTypeList.length === 1) {
      this.setState(
        {
          accountType: accountTypeList[0].customerAccountType
        },
        () => {
          if (type === "same") {
            this.openSame(item);
          } else {
            this.openReal(item);
          }
        }
      );
    } else {
      if (type === "same") {
        this.openSame(item);
      } else {
        this.openReal(item);
      }
    }
  };
  //选择账户类型后点击下一步
  nextStep = () => {
    const { listItem, openType } = this.state;
    if (openType === "same") {
      this.openSame(listItem);
    } else {
      this.openReal(listItem);
    }
    this.isModalVisible("modalAccountType", false);
  };
  renderAccountRadio = accountTypeInfos => {
    const { listItem } = this.state;
    // 过滤权限
    const accountTypeList = accountTypeInfos.filter(
      item => _.get(item, `rights.${listItem.vendor}`, []).length
    );
    const lang = getType();
    return accountTypeList.map(item => {
      const title =
        item.accountTypeName[lang] || (lang === "zh-CN" ? "未命名" : "unknown");
      return (
        <div>
          <Radio
            key={item.customerAccountType}
            //   style={radioStyle}
            value={item.customerAccountType}
          >
            <span>{title}</span>
          </Radio>
          <p className="accountType_desc">{item.accountTypDesc[lang]}</p>
        </div>
      );
    });
  };
  handleAccountChange = e => {
    this.setState({
      accountType: e.target.value
    });
  };
  render() {
    const {
      accountTypeConfig: { accountTypeInfos }
    } = this.props;
    const { modalAccountType, accountType } = this.state;
    return (
      <div className="open-account">
        <div className="account-title">{i18n["openaccount.list"]}</div>
        <ul className="account-ul">{this.renderList()}</ul>
        <CtidModal
          onChange={this.closeModal}
          history={this.props.history}
          type={this.state.type}
          visible={this.state.visible}
        />
        <Modal
          visible={modalAccountType}
          title={i18n["openAccountType.modal.title"]}
          footer={
            <div className="account-modal-footer">
              <Button
                onClick={this.nextStep}
                type={accountType ? "primary" : "default"}
                disabled={accountType ? false : true}
              >
                {i18n["openaccount.next"]}
              </Button>
            </div>
          }
          onCancel={this.isModalVisible.bind(this, "modalAccountType", false)}
        >
          <div className="account_modal_container">
            <Radio.Group
              onChange={this.handleAccountChange}
              value={accountType}
            >
              {accountTypeInfos &&
                accountTypeInfos.length &&
                this.renderAccountRadio(accountTypeInfos)}
            </Radio.Group>
          </div>
        </Modal>
      </div>
    );
  }
}

export default connect(
  ({ account, app, common }) => {
    return {
      platformList: account.platformList,
      structConfig: app.structConfig,
      accountList: app.accountList,
      accountDemoCheck: common.accountDemoCheck,
      accountTypeConfig: common.accountTypeConfig
    };
  },
  {
    ...actions,
    ...appActions,
    getDemoAccountCheck
  }
)(injectIntl(openAccount));
