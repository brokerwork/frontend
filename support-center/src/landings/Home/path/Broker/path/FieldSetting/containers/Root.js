import { connect } from 'react-redux';
import Root from '../components/Root';
import { 
  getFieldType
} from '../controls/actions';


export default connect(null, {
  getFieldType
})(Root);