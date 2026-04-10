import { connect } from 'react-redux';
import Root from '../components/Root';
import { getDepositList } from '../controls/actions';

export default connect(null, { getDepositList })(Root);
