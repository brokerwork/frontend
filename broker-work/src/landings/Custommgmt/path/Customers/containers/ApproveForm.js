import { connect } from 'react-redux';
import ApproveForm from '../components/CustomerDetail/ApproveModal/ApproveForm';
import { showTopAlert } from 'commonActions/actions';
import { changeDefaultApproverInfo } from '../controls/actions';
import emulateFields from 'utils/emulateFields';

export default connect(
  ({
    customMgmt: {
      customers: { approveFieldsMap, approverInfo }
    }
  }) => ({
    approveFields: emulateFields(approveFieldsMap),
    approverInfo
  }),
  {
    showTopAlert,
    changeDefaultApproverInfo
  }
)(ApproveForm);
