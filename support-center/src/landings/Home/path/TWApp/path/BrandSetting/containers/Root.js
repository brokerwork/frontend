import { connect } from 'react-redux';
import Root from '../components/Root';
import { 
  getBrandInfo
} from '../controls/actions';


export default connect(({
  brandSettings: {
    brandInfo
  }
}) => ({
  brandInfo
}), {
  getBrandInfo
})(Root);