import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Button, Radio, Modal } from "antd";
const RadioGroup = Radio.Group;
import CtidModal from "./ctidModal.jsx";
import "./openActTest.less";
import i18n from "@/utils/i18n";
import message from "@/components/Message";
import * as actions from "@/actions/Account/openActTest";

class OpenActTest extends Component {
  constructor() {
    super();
    this.state = {
      isShowPass: false,
      isShowNotPass: false,
      subData: [], //  提交数据
      validate: [], //  题目校验
      testResult: {}, //  测试结果
      visible: false,
      type: ""
    };
  }

  componentDidMount() {
    const { getQuestion, match, history } = this.props;
    let redirect = location.pathname.replace("/account/open/acttest", "");
    if (location.search) {
      redirect = redirect + location.search;
    }
    getQuestion().then(res => {
      if (res && res.result && res.data) {
        if (!res.data.enable) {
          if (redirect) {
            let pathname = location.pathname.split("/");
            let vendor = pathname[pathname.length - 1];
            let type = pathname[pathname.length - 2];
            if (vendor === "CTRADER" && type !== "bind") {
              this.setState({
                visible: true,
                type
              });
            } else {
              history.replace(redirect);
            }
          } else {
            history.replace("/account/open");
          }
          return false;
        }
        if (res.data.questions) {
          let temp = [];
          res.data.questions.forEach((item, index) => {
            temp[index] = false;
          });
          this.setState({
            validate: temp
          });
        }
      }
    });
  }

  //  选择答案
  onChange = (index, id, e) => {
    let val = e.target.value;
    let tempData = this.state.subData.slice();
    tempData[index] = { id: id, selectedValue: val };
    this.setState({
      subData: tempData
    });
  };

  //  提交答案
  submit = () => {
    if (this.validateSub()) return false;
    const { subQuestion } = this.props;
    let { subData } = this.state;
    subQuestion(subData).then(res => {
      if (res && res.result && res.data) {
        this.setState({
          testResult: res.data
        });
        //  测试通过
        if (res.data.result == "approve") {
          this.setState({
            isShowPass: true
          });
          //  测试未通过
        } else if (res.data.result == "refuse") {
          this.setState({
            isShowNotPass: true
          });
        }
      }
    });
  };
  //  校验提交答案
  validateSub = () => {
    let result = false;
    let tempValidate = [];
    let { subData, validate } = this.state;
    validate.forEach((item, index) => {
      if (subData[index]) {
        tempValidate[index] = false;
      } else {
        result = true;
        tempValidate[index] = true;
      }
    });
    this.setState({
      validate: tempValidate
    });
    return result;
  };

  //  关闭
  closeCover = () => {
    this.setState({
      isShowNotPass: false,
      subData: []
    });
  };
  //  继续开户
  openAct = () => {
    let redirect = location.pathname.replace("/account/open/acttest", "");
    if (location.search) {
      redirect = redirect + location.search;
    }
    let pathname = location.pathname.split("/");
    let vendor = pathname[pathname.length - 1];
    let type = pathname[pathname.length - 2];
    if (redirect) {
      if (vendor === "CTRADER" && type !== "bind") {
        this.setState({
          visible: true,
          type
        });
      } else {
        this.props.history.replace(redirect);
      }
    } else {
      this.props.history.replace(`/account/open`);
    }
  };
  //  开通模拟账户
  openMockAct = () => {
    let redirect = location.pathname.replace("/account/open/acttest", "");
    if (redirect) {
      let vendor = location.pathname.split("/").pop();
      this.props.history.replace(`/account/open/mock/${vendor}`);
    } else {
      this.props.history.replace(`/account/open`);
    }
  };
  closeModal = () => {
    this.setState({
      visible: false
    });
  };
  render() {
    let questionData = this.props.questionData;
    if (!questionData.enable) {
      return (
        <CtidModal
          onChange={this.closeModal}
          type={this.state.type}
          history={this.props.history}
          visible={this.state.visible}
        />
      );
    }
    let { testResult, subData } = this.state;
    return (
      <div className="open-act-test">
        <div className="test-header">
          <p className="test-header-tit">{i18n["menu.personal.test"]}</p>
          <p className="test-header-con">{i18n["test.title.content.tw"]}</p>
        </div>
        <div className="test-body">
          {/* <div className="test-email">
                        <span className="test-xing">*</span>    
                        <span>电子邮箱</span>
                        <Input />
                        <span>此邮箱用于接收测试结果</span>
                    </div>  */}
          <div className="test-question">
            {questionData.questions.map((item, index) => {
              return (
                <div key={index} className="question-li">
                  <p className="question-tit">
                    {`${index + 1}. `}
                    {item.subject}
                  </p>
                  <RadioGroup
                    value={subData[index] && subData[index]["selectedValue"]}
                    onChange={this.onChange.bind(this, index, item.id)}
                  >
                    {item.options.map((e, i) => {
                      return <Radio value={e.value}>{e.item}</Radio>;
                    })}
                    {this.state.validate[index] ? (
                      <span className="radio-required">
                        {i18n["test.choice.one.tw"]}
                      </span>
                    ) : null}
                  </RadioGroup>
                </div>
              );
            })}
          </div>
          <div className="test-sub">
            <Button className="tw-btn-primary" onClick={this.submit}>
              {i18n["leverage.submit"]}
            </Button>
          </div>
        </div>
        {/* 测试通过 */}
        <div id="testPass">
          <Modal
            title={testResult.resultTitle}
            footer={
              <Button className="tw-btn-primary" onClick={this.openAct}>
                {i18n["test.goon.open.tw"]}
              </Button>
            }
            maskClosable={false}
            closable={false}
            getContainer={() => document.getElementById("testPass")}
            visible={this.state.isShowPass}
          >
            <div className="test-pass-con">
              <p>{testResult.resultContent}</p>
            </div>
          </Modal>
        </div>
        {/* 测试未通过 */}
        <div id="testNotPass">
          <Modal
            title={testResult.resultTitle}
            footer={
              <Button className="tw-btn-primary" onClick={this.openMockAct}>
                {i18n["test.open.mock.tw"]}
              </Button>
            }
            maskClosable={false}
            getContainer={() => document.getElementById("testNotPass")}
            visible={this.state.isShowNotPass}
            onCancel={this.closeCover}
          >
            <div className="test-pass-con">
              <p>{testResult.resultContent}</p>
            </div>
          </Modal>
        </div>
        <CtidModal
          onChange={this.closeModal}
          history={this.props.history}
          type={this.state.type}
          visible={this.state.visible}
        />
      </div>
    );
  }
}

export default connect(
  ({ account }) => {
    return {
      questionData: account.questionData
    };
  },
  {
    ...actions
  }
)(OpenActTest);
