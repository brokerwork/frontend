import { connect } from 'react-redux';
import OperateType from '../components/OperateType';
import {
  getDepositWithdrawInfo,
  updateType,
  createType
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  ({ settings: { depositWithdraw: { depositTypeList } } }) => ({
    depositTypeList
  }),
  {
    getDepositWithdrawInfo,
    updateType,
    createType,
    showTopAlert,
    submitForm: submit
  }
)(OperateType);
