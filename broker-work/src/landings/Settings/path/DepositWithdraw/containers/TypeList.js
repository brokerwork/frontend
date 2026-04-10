import { connect } from 'react-redux';
import TypeList from '../components/TypeList';
import {
  getDepositWithdrawInfo,
  removeType,
  setParams
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    settings: {
      depositWithdraw: { depositTypeList, params }
    }
  }) => ({
    depositTypeList,
    params
  }),
  {
    getDepositWithdrawInfo,
    showTipsModal,
    showTopAlert,
    removeType,
    setParams
  }
)(TypeList);
