// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { 
  Form, FormGroup, Col, 
  ControlLabel, DatePicker,
  CountryPicker, Button,
  FormControl,
  Message
} from 'fooui'
import ActionTypes from '../actions/actionTypes';
import { connect } from 'react-redux';
import { IAccountState } from '../store/mt4store';
import {
    AccountDTO as Account, ExternalInfo} from '../model/account';
import {
  creditIn,
  creditOut
} from '../actions/editAccountActions';
import { I18nLoader } from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
/* ------------------- main start ---------------------- */
enum creditWay {
  creditIn,
  creditOut
}

interface P {
  currentAccount?: Account,
  dispatch?: Function
}

interface S {
 cWay?: creditWay;
}

class PanelCredit extends React.Component<P,S> {
  constructor( props:any ) {
    super( props );
    this.state = {
      cWay: creditWay.creditOut
    }
  }

  close =()=>{
    this.props.dispatch( {
      type: ActionTypes.HideAccountEditor
    } )
  }

   credit = ()=>{
    let amount = this.refs.amountInput.value;
    let creditAmount = this.refs.creditLineInput.value;
    let comment = this.refs.commentTA.value;
    let way = +this.state.cWay;
    let expirationTime = moment(this.refs.expirationTime.getSelectedDate()).format("YYYY-MM-DD");
    let ACCOUNTMT4_MODIFY_CREDIT  = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_MODIFY-CREDIT");
    if(ACCOUNTMT4_MODIFY_CREDIT){
            switch( way ) {
              case creditWay.creditIn: {
                this.props.dispatch( creditOut( +amount,creditAmount,comment, expirationTime ) );
                break;
              }
              case creditWay.creditOut: {
                this.props.dispatch( creditIn( +amount,creditAmount,comment, expirationTime ) );
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
        cWay: v
      } )
    }
  }

  reset = ()=>{
    ReactDOM.findDOMNode( this.refs.amountInput ).value = '';
    ReactDOM.findDOMNode( this.refs.creditLineInput ).value = '';
    ReactDOM.findDOMNode( this.refs.commentTA ).value = '';
    this.setState( {
        cWay:  creditWay.creditIn
      } )
  }

  
  render() {
    return (
            <div>
        <Form horizontal ref="form" style={{padding: 20}}>
          <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                  账户信用：
              </Col>
              <Col sm={4}>
                  <input 
                    className="form-control"
                    type="text" 
                    ref="creditLineInput"
                    readOnly
                    value={this.props.currentAccount.credit}
                    />
              </Col>
              <Col componentClass={ControlLabel} sm={2}>
                  类型：
              </Col>
              <Col sm={4}>
                <input className="radio-inline" 
                       type="radio" id="purpose1" 
                       name="purpose"
                       value={creditWay.creditOut}
                       checked={this.state.cWay == creditWay.creditOut}
                       onChange={this.changeWay}
                       />
                <label className="control-label" htmlFor="purpose1">&nbsp;借信用&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input className="radio-inline" 
                       type="radio" id="purpose2" 
                       name="purpose"
                       value={creditWay.creditIn}
                       checked={this.state.cWay == creditWay.creditIn}
                       onChange={this.changeWay}
                />
                <label className="control-label" htmlFor="purpose2">&nbsp;还信用</label>
              </Col>
          </FormGroup>
          <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                  <span className="important-info">* </span>到期时间：
              </Col>
              <Col sm={4}>
                  <DatePicker 
                        style={{width: '100%'}}
                        showYearDropdown
                        className="form-control"
                        dateFormat="YYYY-MM-DD"
                        ref="expirationTime"
                    />
              </Col>
              <Col componentClass={ControlLabel} sm={2}>
                  <span className="important-info">* </span>金额（$）：
              </Col>
              <Col sm={4}>
                  <input 
                    className="form-control"
                    type="text" 
                    ref="amountInput"
                    />
              </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>备注：</Col>
            <Col sm={10}>
              <textarea className="form-control" ref="commentTA"></textarea>
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
                    onClick={this.credit}
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
})(PanelCredit)