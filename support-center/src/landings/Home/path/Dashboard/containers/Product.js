import { connect } from 'react-redux';
import Product from '../components/Product';


export default connect(({
  common: {
    tenantInfo
  }
}) => ({
  tenantInfo
}), {})(Product);