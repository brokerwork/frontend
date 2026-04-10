// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  Form,
  FormGroup,
  ControlLabel,
  Col,
  CountryPicker,
  FormControl,
  Button,
  Message
} from 'fooui'
import { IAccountState } from '../store/mt4store';
import {
    AccountDTO as Account, ExternalInfo} from '../model/account';
import { connect } from 'react-redux';
import {
  withdraw,
  deposit,
  transfer
} from '../actions/editAccountActions';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
/* ------------------- main start ---------------------- */

enum WithdrawDepositWay {
  Deposit,
  Withdraw,
  Transfer
}

interface P {
  currentAccount?: Account,
  dispatch?: Function
}

interface S {
  showToBankAcctInput?: boolean,
  wdWay?: WithdrawDepositWay
}

class PanelWnd extends React.Component<P,S> {
  refs:any
  constructor( props:any ) {
    super( props );
    this.state = {
      showToBankAcctInput: false,
      wdWay: WithdrawDepositWay.Deposit
    }
  }

  close =()=>{
    this.props.dispatch( {
      type: ActionTypes.HideAccountEditor
    } )
  }
  deposite = ()=>{
    let amount = this.refs.amountInput.value;
    let sendEmail = this.refs.sendEmailCheckbox.checked ? 1 : 0;
    let remark = this.refs.remarkTA.value;
    let way = +this.state.wdWay;
    let toLogin = this.refs.toBankAcctInput.value;
    let ACCOUNTMT4_MODIFY_DW = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_MODIFY-DW");
    if(ACCOUNTMT4_MODIFY_DW){
      switch( way ) {
        case WithdrawDepositWay.Deposit: {
          this.props.dispatch( deposit( +amount, remark, sendEmail ) );
          break;
        }
        case WithdrawDepositWay.Withdraw: {
          this.props.dispatch( withdraw( +amount, remark, sendEmail ) );
          break;
        }
        case WithdrawDepositWay.Transfer: {
          this.props.dispatch( transfer( +amount, remark, sendEmail, toLogin ) );
          break;
        }
      }
    }else{
        Message.error( I18nLoader.getErrorText("没有修改权限，请联系管理员") );
    }
    

  }
  changeWay = (e:any)=>{
    let target = e.target;
    let v = target.value;
    if ( target.checked ) {
      this.setState( {
        wdWay: v,
        showToBankAcctInput: v == WithdrawDepositWay.Transfer ? true : false
      } )
    }
  }

  reset = ()=>{
    ReactDOM.findDOMNode( this.refs.amountInput ).value = '';
    ReactDOM.findDOMNode( this.refs.sendEmailCheckbox ).checked = false;
    ReactDOM.findDOMNode( this.refs.remarkTA ).value = '';
    ReactDOM.findDOMNode( this.refs.toBankAcctInput ).value = '';
    this.setState( {
        wdWay: WithdrawDepositWay.Deposit,
        showToBankAcctInput: false
      } )
  }

  render() {
    return (
      <div>
        <Form  horizontal ref="form" style={{padding: 20}}>
          <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>账户余额：</Col>
              <Col sm={3}>
                <input 
                    className="form-control"
                    type="text" 
                    ref="balanceInput"
                    disabled
                    value={ this.props.currentAccount.balance }
                    />
              </Col>
              <Col componentClass={ControlLabel} sm={3}><span className="important-info">* </span>浮动盈亏：</Col>
              <Col sm={3}>
                 <input 
                    className="form-control"
                    type="text" 
                    ref="floatingPnlInput"
                    disabled
                    value={this.props.currentAccount.profit}
                    />
              </Col>
          </FormGroup>
          <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>账户净值：</Col>
              <Col sm={3}>
                <input 
                    className="form-control"
                    type="text" 
                    ref="netInput"
                    disabled
                    value={this.props.currentAccount.equity}
                    />
              </Col>
              <Col componentClass={ControlLabel} sm={3}>操作类型：</Col>
              <Col sm={4} className="opera-type">
                <label className="control-label">
                  <input type="radio" className="checkbox-inline" name="wdWay"
                    value={WithdrawDepositWay.Deposit}
                    checked={this.state.wdWay == WithdrawDepositWay.Deposit}
                    onChange={this.changeWay}
                  />
                  &nbsp;存款&nbsp;
                </label>
                
                <label className="control-label">
                  <input type="radio" className="checkbox-inline" name="wdWay"
                    value={WithdrawDepositWay.Withdraw}
                    checked={this.state.wdWay == WithdrawDepositWay.Withdraw}
                    onChange={this.changeWay}
                  />
                  &nbsp;取款&nbsp;
                </label>
                
                <label className="control-label" style={{display:'none'}}>
                  <input 
                    type="radio" 
                    className="checkbox-inline" 
                    name="wdWay"
                    value={WithdrawDepositWay.Transfer}
                    checked={this.state.wdWay == WithdrawDepositWay.Transfer}
                    onChange={this.changeWay}
                    />
                  &nbsp;内部转账&nbsp;
                </label>
              </Col>
          </FormGroup>
          <FormGroup style={{display: this.state.showToBankAcctInput ? 'block': 'none'}}>
              <Col componentClass={ControlLabel} sm={2}></Col>
              <Col sm={3}></Col>
              <Col componentClass={ControlLabel} sm={3}>转到账户：</Col>
              <Col sm={4}>
                <input 
                    className="form-control"
                    type="text" 
                    ref="toBankAcctInput"
                    />
              </Col>
          </FormGroup>
          <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>金额：</Col>
              <Col sm={3}>
                <input 
                    className="form-control"
                    type="text" 
                    ref="amountInput"
                    />
              </Col>
              <Col componentClass={ControlLabel} sm={3}>发送出入金邮件：</Col>
              <Col sm={4}>
                <label className="control-label">
                  <input 
                    type="checkbox" 
                    className="checkbox-inline" 
                    ref="sendEmailCheckbox"
                    />
                  &nbsp;发送
                </label>
              </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>备注：</Col>
            <Col sm={10}>
              <textarea className="form-control" ref="remarkTA"></textarea>
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
                    onClick={this.deposite}
                  >提交</Button>
              </Col>
          </FormGroup>
        </Form>
      </div>
    )
  }
}

function mapStateToProps( state:IAccountState ) {
  let currentAccountId = state.editAccount.currentAccountId;
  let accountList = state.accountTable.accountList;
  let currentAccount = accountList.find( acc=>acc.login===currentAccountId);

  return {
    currentAccount: currentAccount ? currentAccount : new Account({})
  }
}

export default connect<P,any,any>(mapStateToProps, undefined,undefined,{
  withRef: true
})(PanelWnd)