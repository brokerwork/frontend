import { connect } from 'react-redux';
import AccountTradeSetting from '../components/Root';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import {
  getBasicInfo,
  saveBasicInfo,
  updateAccount,
  delAccount,
  getAccountList,
  getBalance,
  addAccount,
  getServerByVendor
} from '../controls/actions';

export default connect(
  ({
    settings: {
      tradeMode: { tradeSetting, accountList, singleBalance, serverGroupList }
    }
  }) => {
    return {
      serverGroupList,
      tradeSetting,
      accountList,
      singleBalance
    };
  },
  {
    showTopAlert,
    showTipsModal,
    getServerByVendor,
    getBasicInfo,
    saveBasicInfo,
    updateAccount,
    delAccount,
    getAccountList,
    getBalance,
    addAccount
  }
)(AccountTradeSetting);
