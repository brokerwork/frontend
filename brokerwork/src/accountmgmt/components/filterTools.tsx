// libs
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { 
  Button,Card, ButtonGroup, CustomDateRangePicker,
  SearchBox,NewSelect
} from 'fooui';
import { IAccountState } from '../store/mt4store';
import AddAccountCard from '../components/addaccountcard'
import { hideAccountEditor, changeUserSearchType, fetchAccount, selectSever, changeDateRange, setFuzzySearch } from '../actions/accountTableActions';
import { initAddAccountCard } from '../actions/addAccountActions';
import * as moment from 'moment';
import ServerHelper from '../utils/serverHelper';
import PrivilegeHelper from '../../common/privilegeHelper';
/* ------------------- main start ---------------------- */

interface P {
  show?: boolean,
  dispatch?: Function,
  startDate: moment.Moment,
  endDate: moment.Moment,
  selectSever:any
}


class FilterTools extends React.Component<P,{}> {
  refs:any
  constructor( props:P ) {
    super( props );
  }
  hideAddAccountCard = ()=>{
    this.refs.AddAccountCard.getWrappedInstance().hide();
  }
  addAccounts = () => {
      this.props.dispatch( hideAccountEditor() )
      this.refs.AddAccountCard.getWrappedInstance().show();
  }
  userTypeChangeHandler = ()=>{
    var userSearchType = this.refs.senseItem.getCurrentItemValue();
    this.props.dispatch( changeUserSearchType(userSearchType) )
    setFuzzySearch( false );
    this.props.dispatch( fetchAccount(1) );
  }

  dateChangeHandler = ( startDate:moment.Moment, endDate:moment.Moment )=>{
      this.props.dispatch( changeDateRange(startDate, endDate) );
      setFuzzySearch( false );
      this.props.dispatch( fetchAccount(1) );
  }
  getserverId  = () => {
    var serverId = this.refs.searchSever.getCurrentItemValue();
    ServerHelper.setServer( serverId );
    this.props.dispatch( fetchAccount(1) );
		  this.props.dispatch(initAddAccountCard());
  }

  render() {
    let style = {
      display: this.props.show ? 'inline-block' : 'none'
    } 
    let privilegeType : any;
        let ACCOUNTMT4_SELECT_DIRECTLY  = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_SELECT_DIRECTLY");
        let ACCOUNTMT4_SELECT_SUBORDINATE = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_SELECT_SUBORDINATE");
        let ACCOUNTMT4_SELECT_WILD = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_SELECT_WILD");
        let ACCOUNTMT4_SELECT_ALL = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_SELECT_ALL");
        let btnprivilege = "所有账户";
        if (ACCOUNTMT4_SELECT_DIRECTLY && ACCOUNTMT4_SELECT_SUBORDINATE && ACCOUNTMT4_SELECT_WILD && ACCOUNTMT4_SELECT_ALL){
            privilegeType = [
                    { label: '归属给我的账户', value: 'sub' },
                    { label: '归属给下级的账户', value: 'subBelong' },
                    { label: '无归属账户', value: 'noParent' },
                    { label: '所有账户', value: 'all' }]
            btnprivilege = "所有账户";
        }else if ( ACCOUNTMT4_SELECT_DIRECTLY && !ACCOUNTMT4_SELECT_SUBORDINATE && !ACCOUNTMT4_SELECT_WILD && !ACCOUNTMT4_SELECT_ALL){
            privilegeType = [
                    { label: '归属给我的账户', value: 'sub' }]
            btnprivilege = "归属给我的账户";
        }else if ( !ACCOUNTMT4_SELECT_DIRECTLY && ACCOUNTMT4_SELECT_SUBORDINATE && !ACCOUNTMT4_SELECT_WILD && !ACCOUNTMT4_SELECT_ALL){
            privilegeType = [
                    { label: '归属给下级的账户', value: 'subBelong' }]
            btnprivilege = "归属给下级的账户";
        }else if ( !ACCOUNTMT4_SELECT_DIRECTLY && !ACCOUNTMT4_SELECT_SUBORDINATE && ACCOUNTMT4_SELECT_WILD && !ACCOUNTMT4_SELECT_ALL){
            privilegeType = [
                    { label: '无归属账户', value: 'noParent' }]
            btnprivilege = "无归属账户";
        }else if ( !ACCOUNTMT4_SELECT_DIRECTLY && !ACCOUNTMT4_SELECT_SUBORDINATE && !ACCOUNTMT4_SELECT_WILD && ACCOUNTMT4_SELECT_ALL){
            privilegeType = [
                   { label: '所有账户', value: 'all' }]
            btnprivilege = "所有账户";
        }else if ( ACCOUNTMT4_SELECT_DIRECTLY && ACCOUNTMT4_SELECT_SUBORDINATE && !ACCOUNTMT4_SELECT_WILD){
            privilegeType = [
                   { label: '归属给我的账户', value: 'sub' },
                   { label: '归属给下级的账户', value: 'subBelong' },
                   { label: '所有账户', value: 'all' }]
            btnprivilege = "所有账户";
        }else if ( ACCOUNTMT4_SELECT_DIRECTLY && !ACCOUNTMT4_SELECT_SUBORDINATE && ACCOUNTMT4_SELECT_WILD){
            privilegeType = [
                   { label: '归属给我的账户', value: 'sub' },
                   { label: '无归属账户', value: 'noParent' },
                   { label: '所有账户', value: 'all' }]
            btnprivilege = "所有账户";
        }else if ( ACCOUNTMT4_SELECT_DIRECTLY && !ACCOUNTMT4_SELECT_SUBORDINATE && !ACCOUNTMT4_SELECT_WILD && ACCOUNTMT4_SELECT_ALL){
            privilegeType = [
                   { label: '归属给我的账户', value: 'sub' },
                   { label: '所有账户', value: 'all' }]
            btnprivilege = "所有账户";
        }else if ( !ACCOUNTMT4_SELECT_DIRECTLY && ACCOUNTMT4_SELECT_SUBORDINATE && !ACCOUNTMT4_SELECT_WILD && ACCOUNTMT4_SELECT_ALL){
            privilegeType = [
                   { label: '归属给下级的账户', value: 'subBelong' },
                   { label: '所有账户', value: 'all' }]
            btnprivilege = "所有账户";
        }else if ( !ACCOUNTMT4_SELECT_DIRECTLY && !ACCOUNTMT4_SELECT_SUBORDINATE && ACCOUNTMT4_SELECT_WILD && ACCOUNTMT4_SELECT_ALL){
            privilegeType = [
                   { label: '无归属账户', value: 'noParent' },
                   { label: '所有账户', value: 'all' }]
            btnprivilege = "所有账户";
        }else if ( !ACCOUNTMT4_SELECT_DIRECTLY && ACCOUNTMT4_SELECT_SUBORDINATE && ACCOUNTMT4_SELECT_WILD){
            privilegeType = [
                   { label: '归属给下级的账户', value: 'subBelong' },
                   { label: '无归属账户', value: 'noParent' },
                   { label: '所有账户', value: 'all' }]
            btnprivilege = "所有账户";
        }
        
        
        
    return (
      <div className="customer-filters" style={ style }>
        <Button bsClass="btn btn-primary fa fa-plus" className={PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_OPEN") ? "privilegeYes" : "privilegeNo"} onClick={this.addAccounts}> 开户</Button>
                  <NewSelect options={this.props.selectSever}
                       iconRight={"fa fa-angle-down"}
                       isChangeText={true}
                       btnText="选择服务器"
                       className="ghost-btn menu-btn newselect-menu newselect-width"
                       ref="searchSever"
                       onChange={ this.getserverId }
            />

          <NewSelect options={privilegeType}
                     iconRight={"fa fa-angle-down"}
                     isChangeText={true}
                     btnText="所有账户"
                     className="ghost-btn menu-btn newselect-menu ghost-btn-long"
                     ref="senseItem"
                     onChange={this.userTypeChangeHandler}
          />
        <ButtonGroup className="calendar-group">
            <NewSelect options={[
            { label: '账户创建时间', value: 'CreateTime' }                                                                ]}
                       iconRight={"fa fa-angle-down"}
                       isChangeText={true}
                       btnText="账户创建时间"
                       className="ghost-btn menu-btn newselect-menu newselect-width"
                       ref="searchDate"
            />
          <CustomDateRangePicker
            defaultStartDate={ this.props.startDate}
            defaultEndDate={ this.props.endDate }
            className="inline-calendar"
            onRangeChange={ this.dateChangeHandler }
            ref="daterangepicker"
          />
        </ButtonGroup>
        <AddAccountCard ref="AddAccountCard"/>
      </div>
    )
  }
}

function mapStateToProps( state:IAccountState ) {
  return {
    show: !(state.accountTable.showBatchTools),
    startDate: state.accountTable.startDate,
    endDate: state.accountTable.endDate,
    selectSever: state.accountTable.selectSever
  }
}

export default connect<P,any,any>( mapStateToProps, null, null, {
  withRef:true
} )( FilterTools );