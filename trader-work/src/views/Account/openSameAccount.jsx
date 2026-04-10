import React, { Component } from "react";
import { connect } from "react-redux";
import { Input } from "antd";
import Step from "@/components/Step";

import Button from "@/components/Button";

import "./openSameAccount.less";
import i18n from "@/utils/i18n";
import VendorHeader from "./vendorHeader";
import Disclaimer from "@/components/Disclaimer";
import message from "@/components/Message";
import ViewField from "@/components/FormField/viewField_older";
import OpenAccountStep from "./openAccountStep";
import * as actions from "@/actions/Account/openSameAccount";
import { setHeaderTitle } from "@/actions/App/app";
import { getType } from "@/utils/language";
import moment from "moment";
import utils from "@/utils/common";
import _ from "lodash";
let MAX;
let STEP; //1、2、3
const FIELDKEYS = {
  1: "firstStepFieldList",
  2: "secondStepFieldList",
  3: "thirdStepFieldList"
};
const VALUEKEYS = { 1: "baseInfo", 2: "financialInfo", 3: "certificatesInfo" };
class openSameAccount extends Component {
  constructor(props) {
    super(props);
    const { vendor } = this.props.match.params;
    this.state = {
      vendor,
      step: 1, //0、1、2
      showComfirm: true, //是否显示表单确认页
      description: "",
      disabled: false
    };
    this.props.getFieldsAndSameInfo(vendor, utils.parseUrlParams().accountType);
    this.props.getSameAccountConfig(vendor);
  }
  componentDidMount() {
    this.props.setHeaderTitle(i18n["menu.accountmgmt.openaccount"]);
  }
  componentWillReceiveProps() {
    this.props.setHeaderTitle(i18n["menu.accountmgmt.openaccount"]);
  }
  //  备注
  desChange = e => {
    this.setState({
      description: e.target.value
    });
  };

  sameCancel = () => {
    history.back();
  };

  nextStep = () => {
    this.formRef.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("success", values);
        const { fields } = this.props;
        Object.keys(values).forEach(k => {
          if (values[k]) {
            if (moment.isMoment(values[k])) {
              values[k] = values[k].format("YYYY-MM-DD");
            }
            //需要将firstStepFieldList等字段里的defaultValue也修改一遍，用户回退时才能记住历史输入
            const currentStep = _.find(fields.accountStepSettings, {
              index: this.state.step
            });
            const item = _.find(_.get(currentStep, "fieldList", []), {
              key: k
            });
            // 给扁平化后的信息赋值，用于之后取值
            fields.resetInfoData[k] = values[k];
            if (item) {
              item.defaultValue = values[k];
            }
          }
        });
        if (this.state.step < MAX) {
          this.setState({ step: ++this.state.step });
        } else {
          fields.isSufficient = true;
        }
        this.props.saveFieldInfo(fields);
      } else {
        console.log("fail", err);
      }
    });
  };
  backStep = () => {
    this.setState({ step: --this.state.step });
  };
  // 将同名账户开户提交的步骤合并成之前的三步
  configSubmitData = () => {
    const {
      fields: { resetInfoData, step },
      fields
    } = this.props;
    for (let key in step) {
      const item = step[key];
      Object.keys(item).forEach(k => {
        item[k] = resetInfoData[k];
      });
    }
    return fields.step;
  };
  //  确认提交
  submit = () => {
    const {
      fields: { riskDesc },
      match,
      submitSameInfo,
      sameAccountConfig
    } = this.props;
    const { values, description } = this.state;
    const disclaimer = this.refs.disclaimer;
    const resetData = this.configSubmitData();
    if (
      !description &&
      sameAccountConfig &&
      sameAccountConfig.accountDescFieldRequired
    ) {
      message["warning"](i18n["openaccount.sameaccount.explain.required"]);
      return;
    }
    //  判断协议是否勾选
    if (disclaimer.hasAgreeAll()) {
      this.setState({
        disabled: true
      });
      let sameInfo = {
        vendorType: match.params.vendor,
        description,
        step1: Object.assign({}, resetData.baseInfo, values || {}),
        step2: Object.assign({}, resetData.financialInfo, values || {}),
        step3: Object.assign({}, resetData.certificatesInfo, values || {})
      };
      if (sameInfo.vendorType === "CTRADER") {
        Object.assign(sameInfo, {
          extend: {
            ctid: this.props.ctid
          }
        });
      }
      submitSameInfo(sameInfo, utils.parseUrlParams().accountType).then(res => {
        if (res.result) {
          message["success"](i18n["sameaccount.apply.success"]);
          this.props.history.push("/account/open");
        } else {
          this.setState({
            disabled: false
          });
        }
      });
    } else if (!disclaimer.state.innerChecked) {
      if (riskDesc.riskTipMode === "DEFAULT_SHOW") {
        message["warning"](i18n["openaccount.risktip.confirm.required"]);
      } else {
        disclaimer.openModal();
      }
    } else if (!disclaimer.state.outerChecked) {
      message["warning"](i18n["openaccount.risktip.confirm.required"]);
    }
  };
  render() {
    const {
      structConfig,
      fields: {
        accountStepSettings = [],
        isSufficient,
        riskDesc,
        openDesc,
        resetInfoData
      },
      sameAccountConfig
    } = this.props;
    if (!accountStepSettings.length && !structConfig) return null;
    const { vendor, step } = this.state;
    const bindIcon = structConfig[vendor].basicSetting.structuralLogo;
    const vendorName = structConfig[vendor].basicSetting.structuralName;
    MAX = accountStepSettings.length;
    return (
      <div className="same-account">
        <VendorHeader
          bindIcon={bindIcon}
          vendorName={vendorName}
          description={i18n["sameaccount.info.confirm"]}
          plat={vendor}
          tip={openDesc && openDesc[getType()]}
        />
        {!isSufficient && MAX > 1 && (
          <Step fields={accountStepSettings} current={step} />
        )}
        {isSufficient ? (
          <div className="same-info">
            <ViewField
              fieldsData={accountStepSettings}
              title={i18n["sameaccount.applying.info"]}
            >
              <div className="same-commont">
                <div className="same-commont-tit">
                  {sameAccountConfig &&
                    sameAccountConfig.accountDescFieldRequired && (
                      <span style={{ color: "red", marginRight: "4px" }}>
                        *
                      </span>
                    )}
                  {i18n["realaccount.homony.comment"]}
                </div>
                <div className="same-commont-con">
                  <Input
                    onChange={this.desChange}
                    placeholder={
                      sameAccountConfig.accountDescFieldHint
                        ? sameAccountConfig.accountDescFieldHint[getType()]
                        : ""
                    }
                  />
                </div>
              </div>
            </ViewField>
            <div className="same-agreement">
              <Disclaimer
                ref="disclaimer"
                protocol={[
                  i18n["openaccount.protocol1"],
                  i18n["openaccount.protocol2"],
                  i18n["openaccount.protocol3"]
                ]}
                riskTipMode={riskDesc.riskTipMode}
                riskDesc={
                  (riskDesc &&
                    riskDesc.riskAgreement &&
                    riskDesc.riskAgreement[getType()]) ||
                  ""
                }
              />
            </div>
            <div className="same-btn">
              <Button
                onClick={this.submit}
                disabled={this.state.disabled}
                type="primary"
              >
                {i18n["sameaccount.confirm.submit"]}
              </Button>
              <Button onClick={this.sameCancel} className="same-cancel">
                {i18n["sameaccount.cancel"]}
              </Button>
            </div>
          </div>
        ) : (
          <div className="open-same-account-step">
            <div className="open-same-account-form">
              <OpenAccountStep
                isSame
                fields={_.get(
                  _.find(accountStepSettings, { index: step }),
                  "fieldList",
                  []
                )}
                resetInfoData={resetInfoData}
                wrappedComponentRef={f => {
                  this.formRef = f;
                }}
              ></OpenAccountStep>
            </div>
            <div className="same-btn">
              {step > 1 ? (
                <Button onClick={this.backStep}>
                  {i18n["openaccount.previous"]}
                </Button>
              ) : null}
              <Button
                onClick={this.nextStep}
                type="primary"
                style={{ marginRight: "140px", marginLeft: "10px" }}
              >
                {step == MAX
                  ? i18n["openaccount.submit"]
                  : i18n["openaccount.next"]}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  ({ app, account, common }) => {
    return {
      structConfig: app.structConfig,
      //   isSufficient: account.isSufficient,
      fields: account.fieldsSameData || {},
      sameAccountConfig: account.sameAccountConfig,
      ctid: common.ctid
    };
  },
  {
    ...actions,
    setHeaderTitle
  }
)(openSameAccount);
