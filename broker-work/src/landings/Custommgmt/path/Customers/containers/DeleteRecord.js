import { connect } from 'react-redux';
import { deleteRecord } from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import DeleteRecord from '../components/DeleteRecord';
export default connect(
  ({ customMgmt: { customers: { followWayOptions, searchType } } }) => ({
    followWayOptions,
    searchType
  }),
  {
    deleteRecord,
    showTopAlert,
    showTipsModal
  }
)(DeleteRecord);
