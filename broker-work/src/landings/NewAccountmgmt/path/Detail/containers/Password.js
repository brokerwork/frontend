import Password from '../components/Password';
import { connect } from 'react-redux';
import { updatePassword } from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  ({
    accountManagement: {
      currentServer,
      passwordRegular,
      detail: { accountId }
    }
  }) => ({
    currentServer,
    passwordRegular,
    accountId
  }),
  { updatePassword, showTopAlert, submit }
)(Password);
