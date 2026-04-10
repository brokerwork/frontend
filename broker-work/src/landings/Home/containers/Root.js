import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  showTopAlert,
  closeTopAlert,
  getBrandInfo
} from 'commonActions/actions';

export default connect(
  ({ common }) => ({
    brandInfo: common.brandInfo,
    topAlertData: common.topAlertData,
    loading: common.loading
  }),
  {
    showTopAlert,
    closeTopAlert,
    getBrandInfo
  }
)(Root);
