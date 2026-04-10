import { connect } from 'react-redux';
import RebateParams from '../components/Root';
import {
  getRuleList,
  createRuleDetail,
  updateRuleDetail,
  removeRuleDetail,
  checkParameter,
  adjustPeriod,
  setCondition,
  getRuleDetail
} from '../controls/actions';
import { getRealTimeStatus } from '../../../../RealTimeRebate/controls/actions';
import {
  getBasicResource,
  getDepositBasicResource
} from '../../../../../../../controls/actions';
import { showTipsModal } from 'commonActions/actions';
import { changeRuleParamsPriority } from '../../../controls/actions';
export default connect(
  ({
    common: { userRights },
    settings: {
      rebate: {
        multiAgent: { rebateParams },
        realTimeRebate: { realTimeStatus }
      },
      base: { level_list }
    }
  }) => {
    return {
      userRights,
      ruleList: rebateParams.ruleList,
      ruleDetail: rebateParams.ruleDetail,
      levelList: level_list,
      realTimeStatus
    };
  },
  {
    getRuleList,
    getBasicResource,
    createRuleDetail,
    updateRuleDetail,
    removeRuleDetail,
    showTipsModal,
    checkParameter,
    getDepositBasicResource,
    adjustPeriod,
    setCondition,
    getRuleDetail,
    changeRuleParamsPriority,
    getRealTimeStatus
  }
)(RebateParams);
