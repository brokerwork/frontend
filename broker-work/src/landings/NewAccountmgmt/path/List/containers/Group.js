import Group from '../components/BatchActions/Group';
import { connect } from 'react-redux';
import { updateGroup } from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  ({
    accountManagement: {
      currentServer,
      resources,
      list: { selectedAccountIds }
    }
  }) => ({
    selectedAccountIds,
    currentServer,
    resources
  }),
  { updateGroup, showTopAlert, showTipsModal, submitForm: submit }
)(Group);
