import { connect } from 'react-redux';
import UpdateCondition from '../components/UpdateCondition';

import {
  updateCustomerConditions,
  updateFieldConditions,
  updateAdvancedLogicType,
  updateConditionName,
  updateConditionRole,
  clearnConditionDetail
} from '../controls/actions';

import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ settings: { searchConditions } }) => {
    return {
      roleList: searchConditions.roleList,
      conditionDetail: searchConditions.conditionDetail
    };
  },
  {
    showTopAlert,
    showTipsModal,
    updateCustomerConditions,
    updateFieldConditions,
    updateAdvancedLogicType,
    updateConditionName,
    updateConditionRole,
    clearnConditionDetail
  }
)(UpdateCondition);
