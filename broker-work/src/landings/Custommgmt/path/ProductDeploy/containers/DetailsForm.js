import { connect } from 'react-redux';
import DetailsForm from '../components/DetailsForm';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import emulateFields from 'utils/emulateFields';

export default connect(
  ({
    customMgmt: {
      deploys: { detailsFieldsMap }
    }
  }) => ({
    detailsFields: emulateFields(detailsFieldsMap)
  }),
  {
    ...actions,
    showTopAlert
  }
)(DetailsForm);
