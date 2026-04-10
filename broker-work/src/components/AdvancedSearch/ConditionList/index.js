import { connect } from 'react-redux';
import ConditionList from './ConditionList';
import {
  showTopAlert,
  getConditions,
  removeCondition,
  showTipsModal
} from 'commonActions/actions';

export default connect(
  null,
  {
    getConditions,
    removeCondition,
    showTopAlert,
    showTipsModal
  },
  null,
  {
    withRef: true
  }
)(ConditionList);
