import { connect } from 'react-redux';
import { submit } from 'redux-form';
import UpdateOpportunityModal from '../components/UpdateOpportunityModal';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import { getFormColumns, updateOpportunity } from '../controls/actions';

export default connect(
  ({ common, customMgmt: { opportunities, customers } }) => ({
    formColumns: opportunities.formColumns,
    customerParticipant: opportunities.customerParticipant
  }),
  {
    getFormColumns,
    updateOpportunity,
    submitForm: submit,
    showTipsModal,
    showTopAlert
  }
)(UpdateOpportunityModal);
