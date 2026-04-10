import { connect } from 'react-redux';
import Order from '../components/Order';
import {
  getOrderList,
  getOrderDetail
} from '../controls/actions';


export default connect(({
  consumption: {
    orderList,
    orderType,
    orderStatus
  }
}) => ({
  orderList,
  orderType,
  orderStatus
}), {
  getOrderList,
  getOrderDetail
})(Order);