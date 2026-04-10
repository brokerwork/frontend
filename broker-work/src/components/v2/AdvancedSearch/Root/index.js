import { connect } from 'react-redux';
import Root from './Root';
import {
  showTopAlert,
  createCondition,
  updateCondition,
  getConditionsListDetail
} from 'commonActions/actions';

export default connect(
  null,
  {
    createCondition,
    updateCondition,
    getConditionsListDetail,
    showTopAlert
  },
  null,
  {
    withRef: true
  }
)(Root);
