import { connect } from 'react-redux';
import Add from '../components/Add';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  ({ customMgmt: { contracts: { productList } } }) => ({ productList }),
  {
    ...actions,
    showTopAlert,
    submitForm: submit
  }
)(Add);
