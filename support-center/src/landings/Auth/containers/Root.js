import { connect } from 'react-redux';
import Root from '../components/Root';
import {getSystemLanguages} from 'common/actions'

export default connect(null, {getSystemLanguages})(Root);
