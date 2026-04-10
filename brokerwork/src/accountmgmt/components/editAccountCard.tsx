// libs
import * as React from 'react';
import { Card, Tabs, Tab } from 'fooui';
import { connect } from 'react-redux';
import * as moment from 'moment'
// model
import {
    AccountDTO as Account, ExternalInfo} from '../model/account';
import { IAccountState } from '../store/mt4store';
import { hideAccountEditor } from '../actions/accountTableActions';
import { initFinInfoPanel } from '../actions/editAccountActions';
// ui
import PanelAcctInfo from './panelAcctInfo';
import PanelBaseInfo from './panelBaseInfo';
import PanelCertInfo from './panelCertInfo';
import PanelCredit from './panelCredit';
import PanelFinInfo from './panelFinInfo';
import PanelLeverage from './panelLeverage';
import PanelPwd from './panelPwd';
import PanelWnd from './panelWnd';
import { HttpClient } from '../../http/httpclient';
import { LoadingMask } from 'fooui';
import ActionTypes from '../actions/actionTypes';
import { 
  initEditAccInfoCard, 
  changeAccountEditorCardTab,
  fetchAllCustomers,
  initLeveragePanel,
  initCerInfo
} from '../actions/editAccountActions';
/* ------------------- main start ---------------------- */

interface P {
  show: boolean,
  currentAccount: Account,
  dispatch?: Function,
  currentTabEventKey?: AccountEditorTabKeys
}

enum AccountEditorTabKeys {
  BaseInfo,
  AcctInfo,
  FinInfo,
  CertInfo,
  Leverage,
  Pwd,
  Wnd,
  Credit
}

class EditAccountCard extends React.Component<P,{}> {
  refs: any;
  constructor( props:P ) {
    super( props );
  }
  hideHandler = ()=>{
    this.props.dispatch( hideAccountEditor() )
  }

  switchTabHandler = ( eventKey:any ) => {
    this.props.dispatch( changeAccountEditorCardTab(eventKey) )
    let self = this;
    /*if ( eventKey === AccountEditorTabKeys.BaseInfo ) {
      // 初始化基础资料panel 请参见 initEditAccountCard in accountmgmt/actions/editAccountActions.ts
    } */
    if ( eventKey === AccountEditorTabKeys.FinInfo ) {
      this.props.dispatch( initFinInfoPanel() );
    } else if (eventKey === AccountEditorTabKeys.AcctInfo){
      //初始化账户信息panel
      var queryParam = {
            fuzzyItem: "CustomerName",
            fuzzyVal: ''
        }
       self.props.dispatch( initEditAccInfoCard());
       self.props.dispatch( fetchAllCustomers(queryParam) );
    } else if ( eventKey === AccountEditorTabKeys.Leverage ) {
      // 杠杆panel初始化
      this.refs.leveragePanel.getWrappedInstance().reset();
      this.props.dispatch( initLeveragePanel() )
    } else if ( eventKey === AccountEditorTabKeys.Pwd ) {
      this.refs.pwdPanel.getWrappedInstance().reset()
    } else if ( eventKey === AccountEditorTabKeys.Wnd ) {
      this.refs.wndPanel.getWrappedInstance().reset()
    } else if ( eventKey === AccountEditorTabKeys.CertInfo ) {
      this.props.dispatch( initCerInfo() )
    }
  }

  render() {
    return (
      <Card 
        title="编辑账户" 
        show={this.props.show}
        className="ed-card-cus"
        onHide={ this.hideHandler }
      >
        <div className="ed-acct-title">
          <span className="acct-id">
            <i className="fa fa-user"></i>
            { this.props.currentAccount ? this.props.currentAccount.login : '' }
          </span>
          {/**          <span className="acct-create-time">开户时间：{
            this.props.currentAccount ? moment(this.props.currentAccount.regdate).format('YYYY-MM-DD') : ''
          }</span> */}
        </div>
        <Tabs 
          activeKey={this.props.currentTabEventKey} 
          className="ed-acct-tabs"
          onSelect={ this.switchTabHandler }
        >
          <Tab eventKey={AccountEditorTabKeys.BaseInfo} title="基本资料">
            <PanelBaseInfo />
          </Tab>
          <Tab eventKey={AccountEditorTabKeys.AcctInfo} title="账户信息">
            <PanelAcctInfo/>
          </Tab>
          <Tab eventKey={AccountEditorTabKeys.FinInfo} title="财务信息">
            <PanelFinInfo/>
          </Tab>
          <Tab eventKey={AccountEditorTabKeys.CertInfo} title="证件信息">
            <PanelCertInfo ref="certInfoPanel"/>
          </Tab>
          <Tab eventKey={AccountEditorTabKeys.Leverage} title="杠杆">
            <PanelLeverage ref="leveragePanel"/>
          </Tab>
          <Tab eventKey={AccountEditorTabKeys.Pwd} title="重置密码">
            <PanelPwd ref="pwdPanel"/>
          </Tab>
          <Tab eventKey={AccountEditorTabKeys.Wnd} title="出入金">
            <PanelWnd ref="wndPanel"/>
          </Tab>
          <Tab eventKey={AccountEditorTabKeys.Credit} title="信用">
            <PanelCredit ref="crePanel"/>
          </Tab>
        </Tabs>
      </Card>
    )
  }
}


function mapStateToProps( state:IAccountState ) {
  let currentAccountId = state.editAccount.currentAccountId;
  let accountList = state.accountTable.accountList;
  let currentAccount = accountList.find( acc=>acc.login===currentAccountId);

  return {
    show: state.editAccount.showEditor,
    currentAccount: currentAccount,
    currentTabEventKey: state.editAccount.currentTabEventKey,
    customerArray: state.editAccount.customerArray,
  }
}

export default connect<P,any,any>(mapStateToProps)(EditAccountCard)

export { AccountEditorTabKeys }