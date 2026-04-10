import { connect } from 'react-redux';
import Root from '../components/Root';
import {
  changeLanguage
} from 'common/actions';
import {
  login
} from '../controls/actions';

export default connect(null, {
  changeLanguage,
  login
})(Root);