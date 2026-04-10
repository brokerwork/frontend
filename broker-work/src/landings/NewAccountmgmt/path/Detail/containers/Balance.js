import Balance from '../components/Balance';
import { reset, submit } from 'redux-form';
import { connect } from 'react-redux';
import {
  getAccountDetail,
  updateBalance,
  getOsConfig,
  commitTaskApply,
  getBankLists,
  getBindBank,
  getMaxWithdraw,
  getFormFields,
  getWithdrawList,
  getRelateAccountList,
  verifyAccount
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
export default connect(
  ({
    accountManagement: {
      currentServer,
      serverList,
      resources,
      detail: {
        accountId,
        osConfig,
        accountInfo,
        ownerInfo,
        bankLists,
        bindBank,
        maxWidthdraw,
        formFields,
        withdrawList,
        relateAccountList,
        ownerRelatedInfo
      }
    },
    common: { userRights }
  }) => ({
    currentServer,
    resources,
    accountId,
    osConfig,
    accountInfo,
    ownerInfo,
    bankLists,
    bindBank,
    maxWidthdraw,
    formFields,
    withdrawList,
    relateAccountList,
    serverList,
    userRights,
    ownerRelatedInfo
  }),
  {
    getAccountDetail,
    updateBalance,
    showTopAlert,
    resetForm: reset,
    submit,
    getOsConfig,
    commitTaskApply,
    getBankLists,
    getBindBank,
    getMaxWithdraw,
    getFormFields,
    getWithdrawList,
    getRelateAccountList,
    verifyAccount
  }
)(Balance);
