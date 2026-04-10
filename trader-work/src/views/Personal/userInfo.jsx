import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Row, Col, Modal, Input, Form } from "antd";
import { ls, USER_INFO } from "@/utils/storage";
import utils from "@/utils/common";

const TabPane = Tabs.TabPane;

import "./userInfo.less";
import i18n from "@/utils/i18n";
import Button from "@/components/Button";
import Message from "@/components/Message";
import {
  UserName,
  PassWord,
  ModifyEmail,
  ModifyPhone,
  AddBand
} from "./userInfoBasic";
import * as actions from "@/actions/Personal/userInfo";
import * as appActions from "@/actions/App/app";
import { getFaData, configAccess } from "@/actions/Common/common";
import SecuritySetting from "./components/SecuritySetting";
import DoubleValidate from "@/components/DoubleValidate";
import _ from "lodash";

class UserInfo extends Component {
  constructor(props) {
    super(props);
    const activeKey = utils.parseUrlParams().activeTab
      ? utils.parseUrlParams().activeTab
      : ls.getItem("FORCE_VALIDATE")
      ? "3"
      : "1";
    this.state = {
      isUserName: false,
      isPassWord: false,
      isEmail: false,
      isPhone: false,
      isAdd: false,
      isEdit: false,
      editItem: null,
      googleValidateModal: false,
      smsValidateModal: false,
      activeKey,
      isShowDoubleModal: false
    };
    this.props.configAccess();
    this.props.getAllBank();
    this.props.getFaData();
  }
  firstSet = false;
  componentDidMount() {
    const { setHeaderTitle, getFaData, getGoogleValidate } = this.props;
    setHeaderTitle(i18n["menu.personal.basicinfo"]);
    if (this.state.activeKey === "3") {
      getFaData();
      getGoogleValidate();
    }
  }
  componentWillReceiveProps() {
    this.props.setHeaderTitle(i18n["menu.personal.basicinfo"]);
    const force = ls.getItem("FORCE_VALIDATE");
    if (!this.firstSet && force) {
      this.firstSet = true;
      this.setState({
        activeKey: "3"
      });
    }
  }
  showModal = (modal, boolean) => {
    this.setState({
      [modal]: boolean
    });
  };
  onTabChange = key => {
    const { getBankAccounts, getFaData, getGoogleValidate } = this.props;
    this.setState({
      activeKey: key
    });
    if (key === "2") {
      getBankAccounts();
    } else if (key === "3") {
      getGoogleValidate();
    }
  };
  checkBank = bankName => {
    const { allBank } = this.props;
    let bank = "";
    bank =
      allBank &&
      allBank.find(item => {
        return item.value == bankName;
      });
    return (bank && bank.label) || bankName;
  };
  //  设为默认
  setDefault = item => {
    this.props
      .updateBank({
        ...item,
        bankId: item.bankName,
        isDefault: true
      })
      .then(res => {
        if (res && res.result) {
          Message["success"](i18n["overview.default.success"]);
          this.props.getBankAccounts();
        }
      });
  };
  //  编辑
  edit = item => {
    this.setState({
      editItem: item,
      isEdit: true
    });
  };
  //  删除
  remove = item => {
    this.props.deleteBank(item.id).then(res => {
      if (res && res.result) {
        Message["success"](i18n["tausermgmt.successfully.delete"]);
        this.props.getBankAccounts();
      }
    });
  };
  // 修改手机二次验证
  openModifyPhone = () => {
    this.doubleValidate();
  };
  // 是否二次验证
  doubleValidate = () => {
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
          "CHANGE_PHONE"
        )
      ) {
        this.setState({
          isShowDoubleModal: true
        });
      } else {
        this.afterValidate();
      }
    } else {
      // 未启用
      this.afterValidate();
    }
  };
  afterValidate = () => {
    this.showModal("isPhone", true);
  };
  closeDoubleModal = () => {
    this.setState({
      isShowDoubleModal: false
    });
  };
  render() {
    const {
      allBank,
      modifyUserName,
      modifyPswd,
      modifyEmail,
      modifyPhone,
      accountList,
      getCheckCode,
      getAccountList,
      bankAccounts,
      addNewBank,
      updateBank,
      getBankAccounts,
      configAcessResult,
      validateSettingData,
      googleValidate
    } = this.props;
    const {
      isUserName,
      isPassWord,
      isEmail,
      isPhone,
      isAdd,
      isEdit,
      editItem,
      activeKey,
      isShowDoubleModal
    } = this.state;
    const accountInfo = accountList.accountInfo || {};
    const isShowSafeSetting = _.get(
      configAcessResult,
      "twoFAConfig.enable",
      false
    );
    return (
      <div className="page user-info" id="userInfo">
        <Tabs activeKey={activeKey} onChange={this.onTabChange} size="small">
          {/* 基本信息 */}
          <TabPane
            className="basic-info"
            tab={i18n["sameaccount.basic"]}
            key="1"
          >
            <Row>
              <Col className="basic-col" span={2}>
                {i18n["userinfo.base.username"]}
              </Col>
              <Col span={4} offset={1}>
                {accountInfo.userName}
                <span
                  onClick={() => {
                    this.showModal("isUserName", true);
                  }}
                  className="icon-tabianji"
                />
              </Col>
            </Row>
            <Row>
              <Col className="basic-col" span={2}>
                {i18n["userinfo.base.password"]}
              </Col>
              <Col span={4} offset={1}>
                ******
                <span
                  onClick={() => {
                    this.showModal("isPassWord", true);
                  }}
                  className="icon-tabianji"
                />
              </Col>
            </Row>
            <Row>
              <Col className="basic-col" span={2}>
                {i18n["userinfo.base.email"]}
              </Col>
              <Col span={4} offset={1}>
                {accountInfo.email
                  ? accountInfo.email
                  : i18n["userinfo.base.email.unbind"]}
                <span
                  onClick={() => {
                    this.showModal("isEmail", true);
                  }}
                  className="icon-tabianji"
                />
              </Col>
            </Row>
            <Row>
              <Col className="basic-col" span={2}>
                {i18n["userinfo.base.phone"]}
              </Col>
              <Col span={4} offset={1}>
                {accountInfo.mobilePhone
                  ? accountInfo.countryCode + ' ' + accountInfo.mobilePhone
                  : i18n["userinfo.base.email.unbind"]}
                {configAcessResult.allowPhone && <span
                  onClick={this.openModifyPhone}
                  className="icon-tabianji"
                />}
              </Col>
            </Row>
            {/* 用户名modal */}
            <Modal
              closable={false}
              visible={isUserName}
              footer={null}
              getContainer={() => document.getElementById("userInfo")}
              title={i18n["userinfo.base.username"]}
            >
              <UserName
                onOk={modifyUserName}
                getAccountList={getAccountList}
                onCancel={() => {
                  this.showModal("isUserName", false);
                }}
              />
            </Modal>
            {/* 登录密码modal */}
            <Modal
              closable={false}
              visible={isPassWord}
              footer={null}
              getContainer={() => document.getElementById("userInfo")}
              title={i18n["userinfo.base.password"]}
            >
              <PassWord
                onOk={modifyPswd}
                configAcessResult={configAcessResult}
                validateSettingData={validateSettingData}
                onCancel={() => {
                  this.showModal("isPassWord", false);
                }}
              />
            </Modal>
            {/* 绑定邮箱modal */}
            <Modal
              closable={false}
              visible={isEmail}
              footer={null}
              getContainer={() => document.getElementById("userInfo")}
              title={i18n["userinfo.base.email"]}
            >
              <ModifyEmail
                onOk={modifyEmail}
                getAccountList={getAccountList}
                email={accountInfo.email}
                onCancel={() => {
                  this.showModal("isEmail", false);
                }}
                configAcessResult={configAcessResult}
                validateSettingData={validateSettingData}
              />
            </Modal>
            {/* 绑定手机modal */}
            <Modal
              closable={false}
              visible={isPhone}
              footer={null}
              getContainer={() => document.getElementById("userInfo")}
              title={i18n["userinfo.base.phone"]}
            >
              <ModifyPhone
                onOk={modifyPhone}
                getAccountList={getAccountList}
                getCheckCode={getCheckCode}
                phone={accountInfo.mobilePhone}
                countryCode={accountInfo.countryCode}
                validateSettingData={validateSettingData}
                configAcessResult={configAcessResult}
                onTabChange={this.onTabChange}
                onCancel={() => {
                  this.showModal("isPhone", false);
                }}
              />
            </Modal>
            {/* 二次验证弹窗 */}
            <DoubleValidate
              visible={isShowDoubleModal}
              operation="CHANGE_PHONE"
              afterOperate={this.afterValidate}
              closeModal={this.closeDoubleModal}
            />
          </TabPane>
          {/* 安全设置 */}
          {isShowSafeSetting && (
            <TabPane tab={i18n["userInfo.safe.tabTitle"]} key="3">
              <SecuritySetting
                {...this.props}
                onTabChange={this.onTabChange}
                userPhone={accountInfo.mobilePhone}
                accountInfo={accountInfo}
              />
            </TabPane>
          )}
          {/* 银行信息 */}
          <TabPane tab={i18n["userinfo.bank.tabtitle"]} key="2">
            <div className="bank-info">
              {bankAccounts &&
                bankAccounts.map((item, index) => {
                  return (
                    <div key={index} className="bank-list">
                      <Row>
                        <Col span={16}>
                          <div className="bank-account">
                            <span className="bank-name">
                              {this.checkBank(item.bankName)}
                            </span>
                            <span className="bank-number">
                              {item.bankAccountNumber}
                            </span>
                            {item.isDefault && (
                              <span className="bank-default">
                                {i18n["userinfo.bank.defaultsymbol"]}
                              </span>
                            )}
                          </div>
                          <Row className="bank-des">
                            <Col span={12}>
                              <Row>
                                <Col span={6}>
                                  {i18n["userinfo.bank.payee"]}
                                </Col>
                                <Col span={16}>{item.bankAccountName}</Col>
                              </Row>
                            </Col>
                            <Col span={12}>
                              <Row>
                                <Col span={6}>
                                  {i18n["userinfo.bank.swiftcode"]}
                                </Col>
                                <Col span={16}>{item.SWIFT}</Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row className="bank-des">
                            <Col span={12}>
                              <Row>
                                <Col span={6}>
                                  {i18n["userinfo.bank.branchname"]}
                                </Col>
                                <Col span={16}>{item.bankBranchName}</Col>
                              </Row>
                            </Col>
                            <Col span={12}>
                              <Row>
                                <Col span={6}>
                                  {i18n["userinfo.bank.address"]}
                                </Col>
                                <Col span={16}>{item.bankAddress}</Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        <Col className="bank-btn" span={8}>
                          {!item.isDefault && (
                            <Button
                              onClick={() => {
                                this.setDefault(item);
                              }}
                              type="primary"
                            >
                              {i18n["userinfo.bank.settodefault.btn"]}
                            </Button>
                          )}
                          <Button
                            onClick={() => {
                              this.edit(item);
                            }}
                          >
                            {i18n["accountinfo.edit"]}
                          </Button>
                          <Button
                            onClick={() => {
                              this.remove(item);
                            }}
                          >
                            {i18n["userinfo.bank.remove"]}
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  );
                })}
              <div className="bank-add">
                <span
                  onClick={() => {
                    this.showModal("isAdd", true);
                  }}
                  className="icon-xinzeng01"
                />
                <span
                  onClick={() => {
                    this.showModal("isAdd", true);
                  }}
                  className="bank-add-word"
                >
                  {i18n["userinfo.bank.add"]}
                </span>
              </div>
            </div>
            {/* 新增银行 */}
            <Modal
              closable={false}
              visible={isAdd}
              footer={null}
              getContainer={() => document.getElementById("userInfo")}
            >
              <AddBand
                structConfig={this.props.structConfig}
                type="add"
                getBankAccounts={getBankAccounts}
                addNewBank={addNewBank}
                allBank={allBank}
                onCancel={() => {
                  this.showModal("isAdd", false);
                }}
              />
            </Modal>
            {/* 编辑银行 */}
            <Modal
              closable={false}
              visible={isEdit}
              footer={null}
              getContainer={() => document.getElementById("userInfo")}
            >
              <AddBand
                structConfig={this.props.structConfig}
                type="update"
                getBankAccounts={getBankAccounts}
                editItem={editItem}
                updateBank={updateBank}
                allBank={allBank}
                onCancel={() => {
                  this.showModal("isEdit", false);
                }}
              />
            </Modal>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default connect(
  ({ app, personal, common }) => {
    return {
      structConfig: app.structConfig,
      account: app.account,
      allBank: personal.allBank,
      accountList: app.accountList,
      bankAccounts: personal.bankAccounts,
      configAcessResult: common.configAcessResult,
      validateSettingData: common.validateSettingData,
      googleValidate: personal.googleValidate
    };
  },
  {
    ...actions,
    ...appActions,
    getFaData,
    configAccess
  }
)(UserInfo);
