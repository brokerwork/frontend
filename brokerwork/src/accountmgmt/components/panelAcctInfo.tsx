// libs
import * as React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  FormGroup,
  Col,
  ControlLabel,
  Button,
  TreeSelect,
  Message
} from 'fooui'
import { IAccountState } from '../store/mt4store';
import {
  AccountDTO as Account, ExternalInfo
} from '../model/account';
import AccountGroup from '../model/accountGroup';
import UserBelongTo from '../model/userBelongTo';
import Customer from '../model/customer'
import { updateAccInfo, fetchAllCustomers, hideEditAccountCard } from '../actions/editAccountActions';
import { I18nLoader } from '../../i18n/loader';
import PrivilegeHelper from '../../common/privilegeHelper';
import CustomField from '../../common/CustomField/CustomField';
/* ------------------- main start ---------------------- */

var customer = [];
var customermm = [];
interface P {
  currentAccount?: Account,
  dispatch?: Function,
  accountGroupArray?: Array<AccountGroup>,
  userBelongToArray?: Array<UserBelongTo>,
  customerArray?: Array<Customer>,
  hideEditAccountCard: Function,
  fetchAllCustomers: Function,
  accountFields: Object[],
  updateAccInfo: Function,
  accountGroupInfo: Object[]
}

interface S {
  editableAccount: Account,
  customerList: any[]
}

class PanelAcctInfo extends React.Component<P, S> {

  saveHandler = () => {//保存提交数据
    let ACCOUNTMT4_MODIFY_PERSONAL = PrivilegeHelper.getHavePrivilege("ACCOUNTMT4_MODIFY-PERSONAL");
    if (ACCOUNTMT4_MODIFY_PERSONAL) {
      const {currentAccount, updateAccInfo} = this.props;
      updateAccInfo(Object.assign({}, this.accountData, {
        customerId: currentAccount.customerId
      }));
    } else {
      Message.error(I18nLoader.getErrorText("没有修改权限，请联系管理员"));
    }
  }

  dataChange = (data) => {
    this.accountData = data;
  }

  close = () => {
    this.props.hideEditAccountCard();
  }

  render() {
    const {accountFields, currentAccount, userBelongToArray, accountGroupArray, accountGroupInfo} = this.props;
    let fields = accountFields.filter((item) => {
      return ['password', 'investorPassword', 'readOnly', 'enable' , 'leverage', 'login'].indexOf(item.key) === -1;
    });
    return (
      <div className="ed-acct-tab-countent">
        <CustomField
          data={currentAccount}
          i18n={{}}
          fields={fields}
          onChange={this.dataChange}
          externalData={{userId: userBelongToArray, group: accountGroupArray, userGroup: accountGroupInfo}}
        />
        <div className="text-right">
          <Button bsStyle="primary" onClick={this.saveHandler}>提交</Button>
          <Button onClick={this.close}>取消</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: IAccountState) {
  let currentAccountId = state.editAccount.currentAccountId;
  let accountList = state.accountTable.accountList;
  let currentAccount = accountList.find(acc => acc.login === currentAccountId);
  return {
    currentAccount: currentAccount ? currentAccount : new Account({}),
    accountGroupArray: state.addAccount.accountGroupArray,
    userBelongToArray: state.addAccount.userBelongToArray,
    customerArray: state.editAccount.customerArray,
    accountFields: state.editAccount.accountFields,
    accountGroupInfo: state.addAccount.accountGroupInfo,
  }
}

export default connect<P, any, any>(mapStateToProps, {
  updateAccInfo,
  fetchAllCustomers,
  hideEditAccountCard,
})(PanelAcctInfo)