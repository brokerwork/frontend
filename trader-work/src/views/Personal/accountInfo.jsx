import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Form, Tooltip, Modal, Input } from "antd";
import Button from "@/components/Button";
import message from "@/components/Message";
import FormField from "@/components/FormField";
import ViewField from "@/components/FormField/viewField_older";
import { getType, getTypeCountryCode } from "@/utils/language";
import moment from "moment";
import _ from "lodash";

import "./accountInfo.less";
import i18n from "@/utils/i18n";
import * as actions from "@/actions/Personal/accountInfo";
import { setHeaderTitle } from "@/actions/App/app";
import TipsModal from "./modal/TipsModal";
import { configAccess } from "@/actions/Common/common";

import DoubleValidate from "@/components/DoubleValidate";

class AccountInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: "1",
      isEdit: false, //编辑视图
      showForm: true, //确认视图
      viewFields: [], //修改后的所有表单字段信息，用于确认页展示
      changedFields: {}, //有修改的字段key-value，用于最终提交表单
      isShowDoubleModal: false
    };
    this.props.getAccountInfo();
  }
  componentDidMount() {
    this.props.setHeaderTitle(i18n["menu.personal.acctinfo"]);
    this.props.configAccess();
  }
  componentWillReceiveProps() {
    this.props.setHeaderTitle(i18n["menu.personal.acctinfo"]);
  }

  toggleEdit = () => {
    const isEdit = !this.state.isEdit;
    const { fields } = this.props;
    const {
      setting: { type, fieldIds = [] }
    } = fields;
    const fieldSet = new Set(fieldIds);
    ["t_account_profiles", "t_account_finacial", "t_account_id_info"].forEach(
      key => {
        fields[key].forEach(option => {
          if (!isEdit) {
            option.enable = false;
            return;
          }
          //根据配置设置字段是否可以被编辑
          if (type === "SECTION_PERMIT") {
            option.enable = fieldSet.has(option.key);
          } else if (type === "SECTION_NOT_PERMIT") {
            option.enable = !fieldSet.has(option.key);
          } else {
            option.enable = true;
          }
        });
      }
    );
    this.setState({ isEdit });
  };
  showConfirm = () => {
    /**
     * 你问我为什么要分成三个字段组，三个form这么麻烦？还不都是后端搞出来的，三个表单允许有相同key的字段
     */
    console.log('yanz', 'validateFieldsAndScroll')
    this.f1.props.form.validateFieldsAndScroll((err1, values1) => {
      if (!err1) {
        this.f2.props.form.validateFieldsAndScroll((err2, values2) => {
          if (!err2) {
            this.f3.props.form.validateFieldsAndScroll((err3, values3) => {
              if (!err3) {
                const {
                  data,
                  t_account_profiles,
                  t_account_finacial,
                  t_account_id_info
                } = this.props.fields;
                const { base, finance, cert } = data;
                const baseChanged = new FormField().parseChangedFields(
                  base,
                  values1
                );
                const financeChanged = new FormField().parseChangedFields(
                  finance,
                  values2
                );
                const certChanged = new FormField().parseChangedFields(
                  cert,
                  values3
                );
                console.log(1, certChanged);
                if (
                  Object.keys(baseChanged).length +
                    Object.keys(financeChanged).length +
                    Object.keys(certChanged).length >
                  0
                ) {
                  const firstStepFieldList = t_account_profiles.filter(e => {
                    if (baseChanged[e.key] !== undefined) {
                      e.defaultValue = values1[e.key];
                      return true;
                    }
                    return false;
                  });
                  const secondStepFieldList = t_account_finacial.filter(e => {
                    if (financeChanged[e.key] !== undefined) {
                      e.defaultValue = values2[e.key];
                      return true;
                    }
                    return false;
                  });
                  const thirdStepFieldList = t_account_id_info.filter(e => {
                    if (certChanged[e.key] !== undefined) {
                      e.defaultValue = values3[e.key];
                      return true;
                    }
                    return false;
                  });
                  this.setState({
                    viewFields: {
                      firstStepFieldList,
                      secondStepFieldList,
                      thirdStepFieldList
                    },
                    changedFields: { baseChanged, financeChanged, certChanged },
                    showForm: false
                  });
                } else {
                  message["success"](i18n["accountinfo.submit.unmodifiedtips"]);
                }
              } else {
                console.log(values3);
                this.setState({ tabKey: "3" });
              }
            });
          } else {
            console.log(values2);
            this.setState({ tabKey: "2" });
          }
        });
      } else {
        console.log(values1);
        this.setState({ tabKey: "1" });
      }
    });
  };

  onSubmit = () => {
    this.doubleValidate();
    this.setState({ showCommitMessage: false });
  };

  // 二次验证
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
          "ACCOUNT_CHANGE_INFO"
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
    const { base, finance, cert } = this.props.fields.data;
    const { changedFields } = this.state;
    this.props
      .submitAccountInfo({
        baseInfo: Object.assign({}, base, changedFields.baseChanged),
        financeInfo: Object.assign({}, finance, changedFields.financeChanged),
        certificateInfo: Object.assign({}, cert, changedFields.certChanged)
      })
      .then(e => {
        if (e.result) {
          //这里后端可以直接返回是否需要审核，就不用再次获取全量数据
          this.props.getAccountInfo();
          message["success"](i18n["accountinfo.submit.success"]);
          this.setState({
            showForm: true,
            tabKey: "1",
            isEdit: false
          });
        } else {
          // message.error(i18n['accountinfo.submit.failed'])//如果有错误，redux中间件会提示，这里不重复提示了
        }
      });
  };
  closeDoubleModal = () => {
    this.setState({
      isShowDoubleModal: false
    });
  };

  onCancel = () => {
    this.setState({ showCommitMessage: false });
  };

  submitChanged = () => {
    const { base, finance, cert } = this.props.fields.data;
    const { changedFields } = this.state;
    //判断是否设置额外提示信息
    const {
      indicator,
      submitMessage,
      conditionsMsg
    } = this.props.fields.setting;
    const lang = getType();
    const commitMessage = [];
    //根据当前的语言环境获取用户设置的提示信息，如果用户未设置该语言对应的提示信息，提示内容将为空
    if (indicator === "NONE") {
      submitMessage[lang] && commitMessage.push(submitMessage[lang]);
    } else if (indicator === "CONDITION") {
      const changedKeySet = new Set();
      Object.keys(changedFields).forEach(key => {
        Object.keys(changedFields[key]).forEach(fieldKey =>
          changedKeySet.add(fieldKey)
        );
      });
      const fields = [...changedKeySet];
      fields.forEach(key => {
        if (conditionsMsg[key]) {
          conditionsMsg[key][lang] &&
            commitMessage.push(conditionsMsg[key][lang]);
        }
      });
    }
    if (!commitMessage.length) {
      //不存在提示信息
      this.onSubmit();
      return;
    }
    this.setState({ showCommitMessage: true, commitMessage });
  };

  render() {
    const { fields } = this.props;
    if (!fields) return null;
    const {
      showForm,
      isEdit,
      tabKey,
      viewFields,
      showCommitMessage,
      commitMessage = [],
      isShowDoubleModal
    } = this.state;
    const {
      editable,
      setting: { enableModifyAccount = false, message = {} }
    } = fields;
    const msg = message[getType()];
    return (
      <div className="page account-info" id="account-info">
        {!!msg ? <div className="pageTips">{msg}</div> : null}
        {showForm ? (
          <div>
            <Tabs
              activeKey={tabKey}
              onChange={tabKey => this.setState({ tabKey })}
            >
              <Tabs.TabPane
                tab={i18n["accountinfo.profile"]}
                key="1"
                forceRender={true}
              >
                <AccountInfoForm
                  fields={fields.t_account_profiles}
                  wrappedComponentRef={f => {
                    this.f1 = f;
                  }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={i18n["accountinfo.financialinfo"]}
                key="2"
                forceRender={true}
              >
                <AccountInfoForm
                  fields={fields.t_account_finacial}
                  wrappedComponentRef={f => {
                    this.f2 = f;
                  }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={i18n["accountinfo.idinfo"]}
                key="3"
                forceRender={true}
              >
                <AccountInfoForm
                  fields={fields.t_account_id_info}
                  wrappedComponentRef={f => {
                    this.f3 = f;
                  }}
                />
              </Tabs.TabPane>
            </Tabs>
            {enableModifyAccount ? (
              isEdit ? (
                <div>
                  <div className="tips">
                    {i18n["accountinfo.submit.reviewtips"]}
                  </div>
                  <Button
                    type="primary"
                    onClick={this.showConfirm}
                    style={{ marginTop: 20, marginRight: 10 }}
                  >
                    {i18n["accountinfo.submit"]}
                  </Button>
                  <Button onClick={this.toggleEdit} style={{ marginTop: 20 }}>
                    {i18n["general.button.cancel"]}
                  </Button>
                </div>
              ) : (
                <Button
                  disabled={!editable}
                  onClick={editable ? this.toggleEdit : null}
                  style={{ marginTop: 56 }}
                >
                  {editable
                    ? i18n["accountinfo.edit"]
                    : i18n["accountinfo.pending"]}
                </Button>
              )
            ) : null}
          </div>
        ) : (
          <div>
            <div className="account-changed-confirm">
              {i18n["accountinfo.submit.confirm.viewheader"]}
            </div>
            <ViewField
              fieldsData={viewFields}
              showChanged={true}
              title={i18n["accountinfo.submit.confirm.title"]}
            />
            <div style={{ margin: "30px auto", width: "840px" }}>
              <Button type="primary" onClick={this.submitChanged}>
                {i18n["accountinfo.submit.confirm"]}
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                onClick={() => this.setState({ showForm: true })}
              >
                {i18n["accountinfo.submit.back"]}
              </Button>
            </div>
          </div>
        )}
        <TipsModal
          title={i18n["sameaccount.tip"]}
          data={commitMessage}
          visible={showCommitMessage}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
        />
        {/* 二次验证弹窗 */}
        <DoubleValidate
          visible={isShowDoubleModal}
          operation="ACCOUNT_CHANGE_INFO"
          afterOperate={this.afterValidate}
          closeModal={this.closeDoubleModal}
        />
      </div>
    );
  }
}
export default connect(
  ({ personal, common }) => {
    return {
      fields: personal.fields,
      configAcessResult: common.configAcessResult,
      validateSettingData: common.validateSettingData
    };
  },
  {
    ...actions,
    setHeaderTitle,
    configAccess
  }
)(AccountInfo);
//不知道怎么取名，只能加个1了
class AccountInfoForm1 extends Component {
  state = {
    add: false
  };
  addBank = () => {
    this.setState({
      add: true
    });
  };
  confirmName = e => {
    let type = e.nativeEvent.type;
    let code = e.nativeEvent.code;
    if (type === "keypress" && code !== "Enter") return;
    this.props.form.setFieldsValue({
      bankAccount: this.state.bankName
    });
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
  renderFormItem = field => {
    let imageTip = i18n["upload.support.tip"];
    let label = field.label;
    if (((field.remark||field.hint||field.placeHolder) || field.fieldType === "image") && !field.placeHolderShow) {
      label = (
        <span>
          <span>{field.label}</span>
          <Tooltip
            title={(field.remark||field.hint||field.placeHolder) || imageTip}
            placement="right"
            arrowPointAtCenter="true"
            trigger="click"
            getPopupContainer={() => document.getElementById("account-info")}
          >
            <i className="icon-icon_ask" />
          </Tooltip>
        </span>
      );
    } else {
      label = <span>{field.label}</span>;
    }
    if (field.defaultValue) {
      //需要特殊处理的默认值
      if (["date", "datestring"].indexOf(field.fieldType) != -1) {
        field.defaultValue = moment(field.defaultValue);
      } else if (
        field.fieldType == "phone" &&
        !field.defaultValue.countryCode
      ) {
        field.defaultValue.countryCode = getTypeCountryCode();
      }
    } else if (field.defaultValue === undefined) {
      if (field.fieldType == "select") {
        field.defaultValue = "";
      }
    }
    return (
      <Form.Item
        colon={false}
        required={
          field.validateType && field.validateType.required ? true : false
        }
        label={label}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 9 * field.columns }}
      >
        {this.props.form.getFieldDecorator(field.key, {
          initialValue: field.defaultValue,
          rules: [
            {
              type: field.fieldType,
              validator: new FormField(field).fieldValidate
            }
          ]
        })(new FormField({ ...field, addBank: this.addBank }).renderField())}
        <div style={{marginLeft: 10, color: '#989898', lineHeight: '15px'}}>
            {field.placeHolderShow && ((field.remark||field.hint||field.placeHolder) || (field.fieldType === "image" && imageTip))}
        </div>
        
      </Form.Item>
    );
  };
  //渲染级联字段，参数：根字段-Object、所有字段-Array<Object>、DOM结果-Array
  renderRelation = (field, fields, result) => {
    if (
      field.relationFunc &&
      ["radio", "select"].indexOf(field.fieldType != -1)
    ) {
      field.optionList.length &&
        field.optionList.forEach(e => {
          if (e.relationField && field.defaultValue == e.value) {
            const subField = fields.find(f => f.key == e.relationField);
            if (subField && subField.key && subField.fieldType) {
              result.push(this.renderFormItem(subField));
            }
            this.renderRelation(subField, fields, result);
          }
        });
    }
  };
  render() {
    const { fields } = this.props;
    const g = this.props.form.getFieldDecorator;
    const result = [];
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (!field.relation && field.key && field.fieldType) {
        //是否有被其他字段关联,如果是，当前字段不需要显示
        result.push(this.renderFormItem(field));
        this.renderRelation(field, fields, result);
      }
    }
    return [
      <Form>{result}</Form>,
      <Modal
        title={i18n["userinfo.bank.addBankName"]}
        visible={this.state.add}
        onCancel={() => this.setState({ add: false })}
        footer={
          <span>
            <Button onClick={this.confirmName} type="primary">
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
        <Input
          onKeyPress={this.confirmName}
          value={this.state.bankName}
          onChange={this.changeName}
        />
      </Modal>
    ];
  }
}
const AccountInfoForm = Form.create({
  //不太规范
  onValuesChange: ({ fields }, values) => {
    if (fields && fields.length) {
      fields.forEach(e => {
        if (values[e.key] != undefined) {
          e.defaultValue = values[e.key];
        }
      });
    }
  }
})(AccountInfoForm1);
