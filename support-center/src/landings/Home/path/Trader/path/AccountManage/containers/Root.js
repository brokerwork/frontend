import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  getAccountTypeConfig,
  updateAccountTypeConfig,
  deleteAccountTypeConfig,
  getBrandInfo
} from '../../../controls/actions';
import { submit, reset } from 'redux-form';
import { showTopAlert, showTipsModal } from 'common/actions';

export default connect(
  ({ traderCommon: { accountTypeConfig, brandInfo } }) => ({
    accountTypeConfig,
    brandInfo
  }),
  {
    submitForm: submit,
    reset,
    getAccountTypeConfig,
    updateAccountTypeConfig,
    deleteAccountTypeConfig,
    showTopAlert,
    showTipsModal,
    getBrandInfo
  }
)(Root);
