import { connect } from 'react-redux';
import Selector from './Selector';
import { showTipsModal } from 'commonActions/actions';
export default connect(
  null,
  {
    showTipsModal
  },
  null,
  {
    withRef: true
  }
)(Selector);
