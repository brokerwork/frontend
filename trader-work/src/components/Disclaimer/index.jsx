import React, { Component } from "react";
import { Checkbox } from "antd";
import classNames from "classnames";

import i18n from "@/utils/i18n";
import Button from "@/components/Button";
import message from "@/components/Message";
import Modal from "@/components/ScaleModal";
import "./index.less";

class Disclaimer extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      outerChecked: false,
      innerChecked: false
    };
  }

  componentDidMount() {
    const { riskTipMode } = this.props;
    if (riskTipMode == "AUTO_POP") {
      this.setState({
        visible: true
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.riskTipMode !== nextProps.riskTipMode) {
      if (nextProps.riskTipMode == "AUTO_POP") {
        this.setState({
          visible: true
        });
      }
    }
  }

  checkboxChange = e => {
    this.setState({
      outerChecked: e.target.checked
    });
  };
  hintCheck = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      outerChecked: !this.state.outerChecked
    });
  };
  openModal = e => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({
      visible: true
    });
  };
  handleCancel = () => {
    let hasAgreeAll = this.hasAgreeAll("disclaimer-mask");
    this.setState({
      visible: false,
      innerChecked: hasAgreeAll
    });
  };
  //  确认
  handleOk = () => {
    if (this.hasAgreeAll("disclaimer-mask")) {
      this.setState({
        visible: false,
        innerChecked: true,
        outerChecked: true
      });
    } else {
      message["warning"](i18n["openaccount.risktip.confirm.required"]);
    }
  };
  //  判断协议是否全部勾选
  hasAgreeAll = ele => {
    let element = ele || "disclaimer";
    let checkboxArray = document
      .getElementById(element)
      .getElementsByTagName("input");
    // 针对点击弹出的情况处理未渲染出来的modal内容
    if (
      element === "disclaimer" &&
      checkboxArray.length === 1 &&
      this.props.riskDesc.indexOf('type="checkbox"') !== -1
    ) {
      return false;
    }
    let checked = true;
    for (let i = 0; i < checkboxArray.length; i++) {
      if (checkboxArray[i].type == "checkbox" && !checkboxArray[i].checked) {
        checked = false;
      }
    }

    return checked;
  };

  render() {
    const { riskDesc, riskTipMode, className, style, protocol } = this.props;
    const { outerChecked, visible, visiblility } = this.state;
    let disclaimerClassName = classNames("disclaimer", className);
    return (
      <div style={style} id="disclaimer" className={disclaimerClassName}>
        <div className="disclaimer-checkbox">
          <Checkbox checked={outerChecked} onChange={this.checkboxChange} />
          <div className="disclaimer-hint" onClick={this.hintCheck}>
            {protocol[0]}
            <span className="disclaimer-point" onClick={this.openModal}>
              {" "}
              {protocol[1]}{" "}
            </span>
            {protocol[2]}
          </div>
        </div>
        {(riskTipMode == "CLICK_POP" || riskTipMode == "AUTO_POP") && (
          <div id="disclaimer-mask" className="disclaimer-modal">
            <Modal
              visible={visible}
              onCancel={this.handleCancel}
              getContainer={() => document.getElementById("disclaimer-mask")}
              title={i18n["openaccount.protocol.tip"]}
              footer={
                <Button onClick={this.handleOk} type="primary">
                  {i18n["general.button.ok"]}
                </Button>
              }
            >
              <div className="disclaimer-riskDesc">
                <div dangerouslySetInnerHTML={{ __html: riskDesc }}></div>
              </div>
            </Modal>
          </div>
        )}
        {riskTipMode == "DEFAULT_SHOW" && (
          <div className="disclaimer-tile disclaimer-modal">
            <div dangerouslySetInnerHTML={{ __html: riskDesc }}></div>
          </div>
        )}
      </div>
    );
  }
}

export default Disclaimer;
