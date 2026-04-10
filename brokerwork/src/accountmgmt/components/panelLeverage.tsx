// libs
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  Button,
  Message
} from 'fooui';
import { IAccountState } from '../store/mt4store';
import {
    AccountDTO as Account, ExternalInfo} from '../model/account';
import Leverage from '../model/leverage';
import { updateLeverage } from '../actions/editAccountActions';
import ActionTypes from '../actions/actionTypes';
import { I18nLoader } from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
/* ------------------- main start ---------------------- */

interface P {
  currentAccount?: Account,
  leverageArray: Array<Leverage>,
  dispatch?:Function
}

interface S {
  sendEmail?: boolean,
  newLeverage?: any
}

class PanelLeverage extends React.Component<P,S> {
  refs:any;
  constructor( props:any ) {
    super( props );
    this.state = {
      sendEmail: false
    }
  }
  
  updateLeverageHandler = ()=>{
    let ACCOUNTMT4_MODIFY_LEVER  = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_MODIFY-LEVER");
    if (ACCOUNTMT4_MODIFY_LEVER){
      this.props.dispatch( updateLeverage( this.state.newLeverage, this.state.sendEmail ? 1 : 0 ) )
    }else{
      Message.error( I18nLoader.getErrorText("没有修改权限，请联系管理员") );
    }
    
  }

  changeSendEmail = ( e:any )=>{
    this.setState( {
      sendEmail: e.target.checked
    })
  }

  changeNewLeverageSelect = ( e:any )=>{
    this.setState( {
      newLeverage: e.target.value
    } )
  }

  reset=()=>{
    this.setState( {
      sendEmail:false,
      newLeverage:''
    } )
  }

  close = ()=>{
    this.props.dispatch({
      type: ActionTypes.HideAccountEditor
    })
  }

  render() {
    return (
      <div>
        <Form horizontal ref="form" style={{padding: 20}}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={5}>
              当前杠杆：
            </Col>
            <Col sm={7}>
              <input 
                type="text" 
                className="form-control" 
                value={ this.props.currentAccount.leverage }
                disabled
                 style={{width:200}}
              />
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={5}>
              <span className="important-info">* </span>修改杠杆：
            </Col>
            <Col sm={7}>
              <select 
                className="form-control" 
                style={{width:200}} 
                value={this.state.newLeverage}
                onChange={ this.changeNewLeverageSelect }
                >
                {
                  this.props.leverageArray.map(l=>{
                    return <option value={l.zhCN}>{l.zhCN}</option>
                  })
                }
              </select>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={5}>
              发送修改杠杆邮件：
            </Col>
            <Col sm={7}>
              <label className="control-label">
                <input 
                  type="checkbox" 
                  className="checkbox-inline" 
                  checked={this.state.sendEmail}
                  onChange={ this.changeSendEmail }
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
                    onClick={ this.updateLeverageHandler }
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
    currentAccount: currentAccount ? currentAccount : new Account({}),
    leverageArray: state.addAccount.leverageArray
  }
}

export default connect<P,any,any>(mapStateToProps, undefined,undefined,{
  withRef:true
})( PanelLeverage )