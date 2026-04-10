import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTopAlert } from 'common/actions';
import {
  update
} from '../controls/actions';

export default connect(null, {
  update,
  showTopAlert
})(Root);