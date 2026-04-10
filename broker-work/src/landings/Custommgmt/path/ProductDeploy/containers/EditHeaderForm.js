import { connect } from 'react-redux';
import EditHeaderForm from '../components/EditHeaderForm';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import emulateFields from 'utils/emulateFields';

export default connect(
  ({
    customMgmt: {
      deploys: { editHeaderFieldsMap }
    }
  }) => ({
    editHeaderFields: emulateFields(editHeaderFieldsMap)
  }),
  {
    ...actions,
    showTopAlert
  }
)(EditHeaderForm);
