import { connect } from 'react-redux';
import BrandUpdate from '../components/BrandUpdate';
import { showTopAlert } from 'common/actions';
import { 
  getBrandInfo,
  saveBrandInfo
} from '../controls/actions';


export default connect(({
  brandSettings: {
    brandInfo
  }
}) => ({
  brandInfo
}), {
  getBrandInfo,
  saveBrandInfo,
  showTopAlert
})(BrandUpdate);