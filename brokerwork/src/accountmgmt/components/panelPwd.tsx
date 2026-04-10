// libs
import * as React from 'react';
import { connect } from 'react-redux'
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  Button,
  Message
} from 'fooui';
import { updatePwd } from '../actions/editAccountActions';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
/* ------------------- main start ---------------------- */

interface S {
  pwd?: string,
  investmentPwd?: string,
  sendEmail?: boolean
}

class PanelPwd extends React.Component<{ dispatch: Function }, S> {
  constructor(props: any) {
    super(props);
    this.state = {
      pwd: '',
      investmentPwd: '',
      sendEmail: false
    }
  }

  close = () => {
    this.props.dispatch({
      type: ActionTypes.HideAccountEditor
    })
  }

  changePwd = (e: any) => {
    this.setState({
      pwd: e.target.value
    })
  }

  changeInvestmentPwd = (e: any) => {
    this.setState({
      investmentPwd: e.target.value
    })
  }

  changeSendEmail = (e: any) => {
    this.setState({
      sendEmail: e.target.checked
    })
  }

  updatePwdHandler = () => {
    let ACCOUNTMT4_MODIFY_PWD = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_MODIFY-PWD");
    if (ACCOUNTMT4_MODIFY_PWD) {
      const {pwd, investmentPwd, sendEmail} = this.state;
      if (pwd && investmentPwd && pwd === investmentPwd) {
        Message.error(I18nLoader.getErrorText("主密码与投资密码不可以重复, 且不能为空!"));
      } else {
        this.props.dispatch(updatePwd(pwd, investmentPwd, sendEmail ? 1 : 0))
      }
    } else {
      Message.error(I18nLoader.getErrorText("没有修改权限，请联系管理员"));
    }

  }

  reset = () => {
    this.setState({
      pwd: '',
      investmentPwd: '',
      sendEmail: false
    })
  }

  render() {
    return (
      <div>
        <Form horizontal ref="form" style={{ padding: 20 }}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={5}>
              <span className="important-info">* </span>主密码：
            </Col>
            <Col sm={7}>
              <input
                type="password"
                className="form-control"
                style={{ width: 200 }}
                value={this.state.pwd}
                onChange={this.changePwd}
                />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={5}>
              <span className="important-info">* </span>投资者密码：
            </Col>
            <Col sm={7}>
              <input
                type="password"
                className="form-control"
                style={{ width: 200 }}
                value={this.state.investmentPwd}
                onChange={this.changeInvestmentPwd}
                />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={5}>
              发送重置密码邮件：
            </Col>
            <Col sm={7}>
              <label className="control-label">
                <input
                  type="checkbox"
                  className="checkbox-inline"
                  checked={this.state.sendEmail}
                  onChange={this.changeSendEmail}
                  />
                &nbsp;发送
              </label>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={12}>
              <Button
                className="btn-card-cus pull-right"
                onClick={this.close}
                >取消</Button>
              <Button
                bsStyle="primary"
                className="btn-card-cus pull-right"
                onClick={this.updatePwdHandler}
                >提交</Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

export default connect(undefined, undefined, undefined, {
  withRef: true
})(PanelPwd) 