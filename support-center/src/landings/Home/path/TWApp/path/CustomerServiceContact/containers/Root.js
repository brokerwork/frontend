import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTopAlert } from 'common/actions';

import { 
  getData,
  submitData
} from '../controls/actions';


export default connect(null, {
  getData,
  submitData,
  showTopAlert
})(Root);