import { connect } from 'react-redux';
import ChangePwd from '../components/ChangePwd';
import { updatePassword } from '../controls/actions';
import { showTopAlert, logout } from 'commonActions/actions';
import { getPasswordStrength } from '../controls/actions';
export default connect(
  ({
    common: { brandInfo },
    usersetting: {
      base: { password_strength }
    }
  }) => ({
    brandInfo,
    password_strength
  }),
  {
    showTopAlert,
    updatePassword,
    logout,
    getPasswordStrength
  }
)(ChangePwd);
