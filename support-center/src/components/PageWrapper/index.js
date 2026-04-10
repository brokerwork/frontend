import { connect } from 'react-redux';
import Root from './PageWrapper';
import {
  closeTopAlert,
  closeTipsModal,
  getI18nData
} from 'common/actions';

export default connect(({
  common
}) => ({
  loading: common.loading,
  transparentMask: common.transparentMask,
  topAlertData: common.topAlertData,
  tipsModalData: common.tipsModalData
}), {
  closeTopAlert,
  closeTipsModal,
  getI18nData
})(Root);