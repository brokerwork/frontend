import { connect } from 'react-redux';
import SendSuccess from '../components/SendSuccess';
import { setPageTitle } from '../../../controls/actions';

export default connect(({ messages }) => ({}), {
  setPageTitle
})(SendSuccess);
