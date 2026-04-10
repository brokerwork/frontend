import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  getProductDetail,
  getProductLimit,
  resetToken,
  upPublicKey
} from '../../../controls/actions';
import {
  showTipsModal,
  showTopAlert
} from 'common/actions';


export default connect(({
  traderCommon: {
    productDetail,
    productLimit
  }
}) => ({
  productDetail,
  productLimit
}), {
  getProductDetail,
  getProductLimit,
  resetToken,
  showTipsModal,
  showTopAlert,
  upPublicKey
})(Root);