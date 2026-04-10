import { connect } from 'react-redux';
import OrderDetail from '../components/OrderDetail';


export default connect(({
  consumption: {
    orderDetail,
    orderType,
    periodType
  }
}) => ({
  detail: orderDetail,
  orderType,
  periodType
}), {
})(OrderDetail);