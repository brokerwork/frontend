import { connect } from 'react-redux';
import SendMessage from '../components/SendMessage';
import * as actions from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ customMgmt: { customers: { selectedItemsMap, typesOptions } } }) => ({
    selectedItemsMap,
    typesOptions
  }),
  {
    ...actions,
    showTopAlert,
    showTipsModal
  }
)(SendMessage);
