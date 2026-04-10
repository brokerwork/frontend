import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTopAlert } from 'commonActions/actions';
import { getTypeField, getFieldsDetail, getTypeFieldEdit } from '../controls/actions';

export default connect(
  ({
    reportManagement: {
      customReportEditor: { reportName, userRange, fieldsDetail }
    }
  }) => ({
    reportName,
    userRange,
    fieldsDetail
  }),
  {
    showTopAlert,
    getTypeField,
    getFieldsDetail,
    getTypeFieldEdit
  }
)(Root);
