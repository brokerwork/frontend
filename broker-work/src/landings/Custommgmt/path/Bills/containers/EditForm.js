import { connect } from 'react-redux';
import EditForm from '../components/EditForm';
import * as actions from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import emulateFields from 'utils/emulateFields';
import { submit, change, getFormValues } from 'redux-form';
import { BILL_FORM } from '../components/EditForm/BillForm';
import { REFUND_INFO_FORM } from '../components/EditForm/RefundList/Form';
export default connect(
  state => {
    const {
      common,
      customMgmt: {
        bills: { productList, billDetail, refundList, exportDataReady }
      }
    } = state;
    return {
      productList,
      billDetail,
      refundList,
      exportDataReady,
      userRights: common.userRights,
      billFormValues: getFormValues(BILL_FORM)(state),
      refundFormValues: getFormValues(REFUND_INFO_FORM)(state)
    };
  },
  {
    ...actions,
    showTopAlert,
    submitForm: submit,
    showTipsModal
  }
)(EditForm);
