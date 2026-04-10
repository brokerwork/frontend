import { connect } from 'react-redux';
import MultiAgent from '../components/Root';
import { showTipsModal } from 'commonActions/actions';

import {
  changeRulePriority,
  changeRuleParamsPriority
} from '../controls/actions';

export default connect(({ common }) => {
  return {
    userRights: common.userRights
  };
}, {
  changeRulePriority,
  changeRuleParamsPriority
})(MultiAgent);
