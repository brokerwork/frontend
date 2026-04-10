import { connect } from 'react-redux';
import { submit } from 'redux-form';
import CreateOpportunityModal from '../components/CreateOpportunityModal';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import { getFormColumns, createOpportunity } from '../controls/actions';

export default connect(
  ({ common, customMgmt: { opportunities, customers } }) => ({
    formColumns: opportunities.formColumns,
    userInfo: common.userInfo,
    customerDetailInfo: customers.customerDetailInfo
  }),
  {
    getFormColumns,
    createOpportunity,
    submitForm: submit,
    showTipsModal,
    showTopAlert
  }
)(CreateOpportunityModal);
