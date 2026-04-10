import { connect } from 'react-redux';
import Root from '../components/Root';
import { 
  getProductDetail,
  getMonthCharge
} from '../controls/actions';


export default connect(({
  productDetail: {
  }
}) => ({
}), {
  getProductDetail,
  getMonthCharge
})(Root);