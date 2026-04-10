import { showTipsModal } from 'commonActions/actions';
import { connect } from 'react-redux';
import EllipsisContent from './root.js';

export default connect(null, {
  showTipsModal
})(EllipsisContent);
