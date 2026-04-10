import { connect } from 'react-redux';
import ApplyModal from '../components/ApplyModal';
import { submit } from 'redux-form';

import { showTopAlert } from 'commonActions/actions';

import {
  getRebateAccount,
  applyWithdraw,
  getWithdrawConfig,
  getBankList,
  getDefaultValues,
  getCustomFormFields,
  getMaxWithdraw,
  fetchWithdrawTypeFields,
  fetchEnableWithdrawList
} from '../controls/actions';

export default connect(
  state => {
    return {
      ...state.withDraw
    };
  },
  {
    getRebateAccount,
    applyWithdraw,
    getWithdrawConfig,
    getBankList,
    submitForm: submit,
    showTopAlert,
    getDefaultValues,
    getCustomFormFields,
    getMaxWithdraw,
    fetchWithdrawTypeFields,
    fetchEnableWithdrawList
  }
)(ApplyModal);
