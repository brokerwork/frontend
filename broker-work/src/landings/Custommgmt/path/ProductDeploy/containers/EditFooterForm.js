import { connect } from 'react-redux';
import EditFooterForm from '../components/EditFooterForm';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import emulateFields from 'utils/emulateFields';

export default connect(
  ({
    customMgmt: {
      deploys: { editFooterFieldsMap }
    }
  }) => ({
    editFooterFields: emulateFields(editFooterFieldsMap)
  }),
  {
    ...actions,
    showTopAlert
  }
)(EditFooterForm);
