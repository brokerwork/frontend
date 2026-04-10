import { connect } from 'react-redux';
import Root from './Root';
import {
  showTopAlert,
  createCondition,
  getConditionsListDetail,
  getConditions,
  removeCondition,
  showTipsModal,
  updateCondition
} from 'commonActions/actions';
export default connect(
  null,
  {
    createCondition,
    getConditionsListDetail,
    showTopAlert,
    getConditions,
    removeCondition,
    showTipsModal,
    updateCondition
  },
  null,
  {
    withRef: true
  }
)(Root);
