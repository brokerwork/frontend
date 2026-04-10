import { connect } from 'react-redux';
import Details from '../components/Details';
import { 
  getProductDetail
} from '../controls/actions';


export default connect(({
  productDetail: {
    produceDetail,
    monthCharge
  }
}) => ({
  produceDetail,
  monthCharge
}), {
  getProductDetail
})(Details);