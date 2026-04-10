import { connect } from 'react-redux';
import { showTipsModal } from 'commonActions/actions';
import DepositRuleSetting from '../components/Root';
import {
  changeRulePriority,
  changeRuleParamsPriority
} from '../../../../MultiAgent/controls/actions';
import {
  getRuleList,
  selectRule,
  createRule,
  updateRule,
  removeRule,
  getRuleDetail,
  createRuleDetail,
  updateRuleDetail,
  removeRuleDetail
} from '../controls/actions';
import {
  getDepositBasicResource,
  checkRuleDetail,
  checkParameter
} from '../../../../../../../controls/actions';

export default connect(
  ({
    settings: {
      rebate: {
        multiAgent: { depositRule }
      },
      base: {
        account_list,
        server_group_list,
        deposit_balance_unit,
        level_list,
        server_symbols,
        commission_type
      }
    }
  }) => {
    return {
      accountList: account_list,
      serverGroupList: server_group_list,
      balanceUnit: deposit_balance_unit,
      levelList: level_list,
      serverSymbols: server_symbols,
      commissionType: commission_type,

      ruleList: depositRule.rule_list,
      selectedRule: depositRule.selected_rule,
      ruleDetail: depositRule.rule_detail
    };
  },
  {
    getDepositBasicResource,
    showTipsModal,
    changeRulePriority,
    changeRuleParamsPriority,
    getRuleList,
    selectRule,
    createRule,
    updateRule,
    removeRule,
    getRuleDetail,
    createRuleDetail,
    updateRuleDetail,
    removeRuleDetail,
    checkRuleDetail,
    checkParameter
  }
)(DepositRuleSetting);
