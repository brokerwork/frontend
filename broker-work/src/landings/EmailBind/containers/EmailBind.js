import { connect } from 'react-redux';
import EmailBind from '../components/EmailBind';

import { getEmailState } from '../controls/actions';

export default connect(({}) => ({}), {
  getEmailState
})(EmailBind);
