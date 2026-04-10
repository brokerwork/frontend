import { connect } from 'react-redux';
import CreateModal from '../components/CreateModal';
import { showTipsModal } from 'commonActions/actions';
import { submit } from 'redux-form';
import {
  addTaUser,
  checkTaUser,
  getPasswordStrength,
  getUsers,
  modifyParams
} from '../controls/actions';

export default connect(
  ({ common: { userRights }, taUserMgmt: { password_strength, params } }) => {
    return {
      userRights,
      passwordStrength: password_strength,
      params
    };
  },
  {
    addTaUser,
    checkTaUser,
    submitForm: submit,
    showTipsModal,
    getPasswordStrength,
    getUsers,
    modifyParams
  }
)(CreateModal);