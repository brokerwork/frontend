import { connect } from 'react-redux';
import EditForm from '../components/EditForm';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import emulateFields from 'utils/emulateFields';

export default connect(
  ({
    customMgmt: {
      contracts: { productList, contractFieldsMap }
    }
  }) => ({
    productList,
    contractFields: emulateFields(contractFieldsMap)
  }),
  {
    ...actions,
    showTopAlert
  }
)(EditForm);
