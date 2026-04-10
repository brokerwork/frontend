import { connect } from 'react-redux';
import Edit from '../components/Edit';
import * as actions from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  ({ customMgmt: { bills: { productList, billDetail, isLostCustomer } } }) => ({
    productList,
    billDetail,
    isLostCustomer
  }),
  {
    ...actions,
    showTopAlert,
    submitForm: submit,
    showTipsModal
  }
)(Edit);
