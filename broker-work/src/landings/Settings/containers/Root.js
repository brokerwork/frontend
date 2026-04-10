import { connect } from 'react-redux';
import Settings from '../components/Settings';
import { getBrandInfo } from '../../../commonActions/actions';

export default connect(
  ({ common }) => {
    return {
      userRights: common.userRights,
      brandInfo: common.brandInfo
    };
  },
  {
    getBrandInfo
  }
)(Settings);
