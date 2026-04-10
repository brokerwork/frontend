import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  verify
} from '../controls/actions';

export default connect(null, {
  verify
})(Root);