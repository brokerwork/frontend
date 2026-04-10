import { connect } from 'react-redux';
import Root from '../components/Root';
import { showTopAlert, closeTopAlert } from 'common/actions';

export default connect(
  ({}) => ({}),
  {
    showTopAlert,
    closeTopAlert
  }
)(Root);
