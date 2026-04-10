import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  getProductDetail,
  getProductLimit,
  unlockUser,
  resetToken,
  clearData,
  sendCode,
  cancelAuth,
  rightFunction
} from '../../../controls/actions';
import {
  showTipsModal,
  showTopAlert
} from 'common/actions';


export default connect(({
  brokerCommon: {
    productDetail,
    productLimit,
    brokerRights
  }
}) => ({
  productDetail,
  productLimit,
  brokerRights
}), {
  getProductDetail,
  getProductLimit,
  unlockUser,
  resetToken,
  showTipsModal,
  showTopAlert,
  clearData,
  sendCode,
  cancelAuth,
  rightFunction
})(Root);