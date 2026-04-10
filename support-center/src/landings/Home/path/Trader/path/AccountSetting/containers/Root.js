import { connect } from 'react-redux';
import Root from '../components/Root';
import { getAccountFields } from '../controls/actions';
import { showTipsModal, showTopAlert } from 'common/actions';
import { getBrandInfo } from '../../../controls/actions';

export default connect(
  ({ accountSetting: { accountFields }, traderCommon: { fieldType, brandInfo } }) => ({
    accountFields,
    brandInfo
  }),
  {
    getAccountFields,
    showTipsModal,
    showTopAlert,
    getBrandInfo
  }
)(Root);
