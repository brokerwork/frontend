import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTopAlert, getProductVasSwitch } from 'commonActions/actions';

export default connect(
  ({ common }) => {
    return {
      userRights: common.userRights,
      productVasSwitch: common.productVasSwitch
    };
  },
  {
    showTopAlert,
    getProductVasSwitch
  }
)(Root);
