import { connect } from 'react-redux';
import ActionsBar from '../components/ActionsBar';
import { submit } from 'redux-form';
import {
  onNameChange,
  onUserRangeChange,
  upsertReportData,
  checkName
} from '../controls/actions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    reportManagement: {
      customReportEditor: {
        typeFieldsSelected,
        sortData,
        reportName,
        fieldsDetail,
        userRange
      }
    }
  }) => ({ typeFieldsSelected, sortData, reportName, fieldsDetail, userRange }),
  {
    submitForm: submit,
    onNameChange,
    onUserRangeChange,
    upsertReportData,
    showTipsModal,
    showTopAlert,
    checkName
  }
)(ActionsBar);
