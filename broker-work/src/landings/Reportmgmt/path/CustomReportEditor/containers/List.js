import { connect } from 'react-redux';
import List from '../components/List';
import { submit } from 'redux-form';
import {
  onFieldNameChange,
  onSortChange,
  onFieldRemove
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({
    reportManagement: {
      customReportEditor: { typeFieldsSelected, sortData }
    }
  }) => ({ typeFieldsSelected, sortData }),
  {
    submitForm: submit,
    onFieldNameChange,
    onSortChange,
    onFieldRemove,
    showTopAlert
  }
)(List);
