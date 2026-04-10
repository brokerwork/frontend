import { connect } from 'react-redux';
import { submit } from 'redux-form';
import UpdateSetting from '../components/UpdateSetting';
import { updateSetting } from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({ settings: { depositWithdraw: { depositWithdrawInfo } } }) => ({
    depositWithdrawInfo
  }),
  {
    updateSetting,
    showTopAlert,
    submitForm: submit
  }
)(UpdateSetting);
