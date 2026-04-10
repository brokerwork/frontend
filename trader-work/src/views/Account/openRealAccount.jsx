import { Component } from "react";
import { connect } from "react-redux";
import i18n from "@/utils/i18n";
import VendorHeader from "./vendorHeader";
import FormField from "@/components/FormField";
import Disclaimer from "@/components/Disclaimer";
import ViewField from "@/components/FormField/viewField";
import Phone from "@/components/FormField/phone";
import Button from "@/components/Button";
import message from "@/components/Message";
import * as actions from "@/actions/Account/openRealAccount";
import { setHeaderTitle } from "@/actions/App/app";
import OpenAccountStep from "./openAccountStep";
import * as openAccountActions from "@/actions/Account/openAccount";
import moment from "moment";
import "./openRealAccount.less";
import { getType } from "@/utils/language";
import Step from "@/components/Step";
import utils from "@/utils/common";

let MAX;
let STEP; //当前实际步骤
class OpenRealAccount extends Component {
  constructor(props) {
    super(props);
    const { vendor } = this.props.match.params;
    this.state = {
      vendor,
      step: 1,
      showComfirm: false, //是否显示表单确认页,
      disabled: false
    };
    this.props.getFieldsInfo(vendor, utils.parseUrlParams().accountType);
  }
  componentDidMount() {
    this.props.setHeaderTitle(i18n["openaccount.open.realaccount"]);
  }
  componentWillReceiveProps(nextProps) {
    this.props.setHeaderTitle(i18n["openaccount.open.realaccount"]);
    if (
      "vendor" in nextProps.match.params &&
      nextProps.match.params.vendor != this.props.match.params.vendor
    ) {
      const vendor = nextProps.match.params.vendor;
      this.props.getFieldsInfo(vendor);
      this.setState({ vendor });
    }
  }
  stepBack = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  };
  stepSubmit = () => {
    this.formRef.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Object.keys(values).forEach(k => {
          if (moment.isMoment(values[k])) {
            values[k] = values[k].format("YYYY-MM-DD");
          }
        });
        const { vendor, step } = this.state;
        this.props
          .stepSubmit(
            vendor,
            step,
            utils.parseUrlParams().accountType,
            Object.assign(this.props.info.data[step] || {}, values)
          )
          .then(res => {
            if (res.result) {
              if (step < MAX) {
                this.setState({ step: step + 1 });
              } else {
                this.setState({ showComfirm: true });
              }
            }
            return Promise.resolve(res);
          });
      } else {
        console.log("fail", err);
        console.log("values", values);
      }
    });
  };
  formSubmit = () => {
    let disclaimer = this.refs.disclaimer;
    if (disclaimer.hasAgreeAll()) {
      this.setState({
        disabled: true
      });
      this.props
        .formSubmit(this.state.vendor, utils.parseUrlParams().accountType)
        .then(res => {
          if (res.result) {
            //res.data=true//需要审核
            res.data
              ? message.success(i18n["realaccount.applying"])
              : message.success(i18n["realaccout.notapply"]);
            if (res.data) {
              this.props.history.push(
                `/account/open/applying/live/${this.state.vendor}?accountType=${
                  utils.parseUrlParams().accountType
                }`
              );
            } else {
              this.props.history.push("/personal/overview");
            }
          } else {
            this.setState({
              disabled: false
            });
            return Promise.resolve(res);
          }
        });
    } else if (!disclaimer.state.innerChecked) {
      disclaimer.openModal();
    } else if (!disclaimer.state.outerChecked) {
      message["warning"](i18n["openaccount.risktip.confirm.required"]);
    }
  };
  formBack = () => {
    this.setState({ step: 1, showComfirm: false });
  };
  render() {
    const {
      info,
      info: { fields, data, openDesc, riskDesc } = {},
      structConfig,
      brandInfo
    } = this.props;
    if (!fields || !structConfig) return null;
    const { step, vendor, showComfirm } = this.state;
    const struct = structConfig[vendor];
    const stepItem = _.find(fields, { index: step }) || {};
    const title =
      (stepItem.languageSettingMap && stepItem.languageSettingMap[getType()]) ||
      "";
    MAX = fields.length;
    return (
      <div className="page open-real-account">
        <VendorHeader
          {...this.props}
          onSave={this.stepSubmit}
          showBtn={!showComfirm}
          type="real"
          bindIcon={struct.basicSetting.structuralLogo}
          vendorName={struct.basicSetting.structuralName}
          description={i18n["mockaccount.description"]}
          plat={vendor}
          tip={openDesc && openDesc[getType()]}
        />
        {MAX > 1 && !showComfirm ? (
          <Step fields={fields} current={step} />
        ) : null}
        {!showComfirm && (
          <div className="open-real-account-form">
            <div>
              {fields.length > 5 && <div className="head-title">{title}</div>}
              {
                <OpenAccountStep
                  fields={_.get(
                    _.find(fields, { index: step }),
                    "fieldList",
                    []
                  )}
                  wrappedComponentRef={f => {
                    this.formRef = f;
                  }}
                ></OpenAccountStep>
              }
            </div>
            <div className="btn_panel">
              <span>
                {step > 1 ? (
                  <Button
                    style={{ background: "#fff" }}
                    onClick={this.stepBack}
                  >
                    {i18n["openaccount.previous"]}
                  </Button>
                ) : null}
                <Button
                  onClick={this.stepSubmit}
                  type="primary"
                  style={{ marginRight: "140px", marginLeft: "10px" }}
                >
                  {step == MAX
                    ? i18n["openaccount.submit"]
                    : i18n["openaccount.next"]}
                </Button>
              </span>
            </div>
          </div>
        )}
        {showComfirm && (
          <div>
            <ViewField
              fieldsData={fields}
              title={i18n["openaccount.preview.confirm"]}
            />
            <div className="foot">
              <Disclaimer
                ref="disclaimer"
                protocol={[
                  i18n["openaccount.protocol1"],
                  i18n["openaccount.protocol2"],
                  i18n["openaccount.protocol3"]
                ]}
                className="open-real-disclaimer"
                riskTipMode={riskDesc.riskTipMode}
                riskDesc={
                  (riskDesc &&
                    riskDesc.riskAgreement &&
                    riskDesc.riskAgreement[getType()]) ||
                  ""
                }
              ></Disclaimer>
              <Button
                onClick={this.formSubmit}
                disabled={this.state.disabled}
                type="primary"
              >
                {i18n["openaccount.confirm"]}
              </Button>
              <Button onClick={this.formBack} style={{ marginLeft: "10px" }}>
                {i18n["openaccount.modify"]}
              </Button>
              <Button onClick={window.print} style={{ marginLeft: "10px" }}>
                {i18n["openaccount.print"]}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  ({ account, app }) => {
    return {
      structConfig: app.structConfig,
      info: account.fields || {}
    };
  },
  {
    ...actions,
    ...openAccountActions,
    setHeaderTitle
  }
)(OpenRealAccount);
